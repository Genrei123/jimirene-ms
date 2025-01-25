package com.jwt.spring_security.controller;

import com.jwt.spring_security.model.Branch;
import com.jwt.spring_security.model.Item;
import com.jwt.spring_security.repo.ItemRepo;
import com.jwt.spring_security.service.ItemService;
import com.jwt.spring_security.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
public class ItemController {

    @Autowired
    private ItemRepo itemRepo;

    @Autowired
    private ItemService itemService;

    @Autowired
    private BranchService branchService;
    @Autowired
    private com.jwt.spring_security.repo.branchRepo branchRepo;

    @GetMapping("/items")
    public ResponseEntity<List<Item>> getItems() {
        return itemService.getAllActiveItems();
    }

    @GetMapping("/items/{id}")
    public Item getItem(@PathVariable Long id) {
        return itemRepo.findByItemID(id);
    }

    @PostMapping("/addItem")
    public ResponseEntity<Item> addItem(@RequestBody Item item) {
        // If the frontend is sending just the branchID, use findByBranchID
        Branch branchExists = branchRepo.findByBranchID(item.getBranch().getBranchID());

        if (branchExists == null) {
            return ResponseEntity.badRequest().build(); // 400 Bad Request
        }

        // Set the branch to the item
        item.setBranch(branchExists);
        Item savedItem = itemRepo.save(item);

        return ResponseEntity.ok(savedItem); // 200 OK
    }


    @PostMapping("/addItems")
    public ResponseEntity<List<Item>> addItems(@RequestBody List<Item> items) {
        if (items.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.emptyList()); // 400 Bad Request
        }

        // Validate each item's branchID
        for (Item item : items) {
            Branch branch = branchRepo.findByBranchID(item.getBranch().getBranchID());
            if (branch == null) {
                return ResponseEntity.badRequest().body(Collections.emptyList()); // 400 Bad Request if any branchID is invalid
            }
            item.setBranch(branch); // Set the valid branch for each item
        }

        // Save all items
        List<Item> savedItems = itemRepo.saveAll(items);

        // Return the saved items
        return ResponseEntity.ok(savedItems); // 200 OK
    }

    @PutMapping("/updateItems/{id}")
    public ResponseEntity<Item> updateItems(@PathVariable Long id, @RequestBody Item itemDetails) {
        Item existingItem = itemRepo.findByItemID(id);
        if (existingItem == null) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }

        // Fetch the branch using the branchID
        Branch branch = branchRepo.findByBranchID(itemDetails.getBranch().getBranchID());
        if (branch == null) {
            return ResponseEntity.badRequest().body(null); // 400 Bad Request if branch is not found
        }

        // Set the branch to the existing item
        existingItem.setBranch(branch);

        // Update the properties of the item
        existingItem.setItemName(itemDetails.getItemName());
        existingItem.setItemQuantity(itemDetails.getItemQuantity());
        existingItem.setItemStock(itemDetails.getItemStock());
        existingItem.setItemPrice(itemDetails.getItemPrice());
        existingItem.setManufactureDate(itemDetails.getManufactureDate());
        existingItem.setExpDate(itemDetails.getExpDate());
        existingItem.setStatus(itemDetails.getStatus());

        // Save and return the updated item
        Item updatedItem = itemRepo.save(existingItem);
        return ResponseEntity.ok(updatedItem); // 200 OK
    }


//    @DeleteMapping("/deleteItems")
//    public ResponseEntity<?> deleteItems(@RequestBody List<Long> ids) {
//        itemService.deleteByItemIDs(ids);
//        return ResponseEntity.ok().body("Items deleted successfully");
//    }

    @PutMapping("/deleteItems")
    public ResponseEntity<?> softDeleteItems(@RequestBody List<Long> ids) {
        itemService.softDeleteByItemIDs(ids);
        return ResponseEntity.ok().body("Items soft deleted successfully");
    }

    @PostMapping("/purchaseItems")
    public ResponseEntity<?> purchaseItems(@RequestBody List<Item> purchasedItems) {
        try {
            for (Item purchasedItem : purchasedItems) {
                // Fetch the existing item by ID
                Item existingItem = itemRepo.findByItemID(purchasedItem.getItemID());
                if (existingItem == null) {
                    return ResponseEntity.badRequest().body("Item not found: " + purchasedItem.getItemID());
                }

                // Ensure itemQuantity is not null
                Long existingQuantity = existingItem.getItemQuantity() != null ? existingItem.getItemQuantity() : 0;

                // Check if enough stock is available
                if (existingQuantity < purchasedItem.getItemQuantity()) {
                    return ResponseEntity.badRequest().body("Insufficient stock for item: " + existingItem.getItemName());
                }

                // Deduct the purchased quantity from stock
                existingItem.setItemQuantity(existingQuantity - purchasedItem.getItemQuantity());

                // Save the updated item
                itemRepo.save(existingItem);
            }

            return ResponseEntity.ok("Purchase recorded successfully, and stocks updated.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
        }
    }



}
