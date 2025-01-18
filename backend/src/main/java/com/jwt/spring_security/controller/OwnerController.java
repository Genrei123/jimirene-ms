package com.jwt.spring_security.controller;

import com.jwt.spring_security.model.Item;
import com.jwt.spring_security.model.Users;
import com.jwt.spring_security.model.Visit;
import com.jwt.spring_security.repo.ItemRepo;
import com.jwt.spring_security.repo.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/owner")
public class OwnerController {

    @Autowired
    private VisitRepository visitRepository;

    @Autowired
    private ItemRepo itemRepo;

    // Generate clinic report
    @GetMapping("/generateReport")
    public ResponseEntity<List<Visit>> viewClinicReport() {
        List<Visit> visits = visitRepository.findAll();
        if (visits.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        return ResponseEntity.ok(visits); // 200 OK
    }

    // Add an item
    @PostMapping("/addItem")
    public ResponseEntity<Item> addItem(
            @RequestBody Item itemDetails
    ) {
        if (itemDetails == null || itemDetails.getItemName() == null) {
            return ResponseEntity.badRequest().body(null); // 400 Bad Request
        }
        Item savedItem = itemRepo.save(itemDetails);
        return ResponseEntity.ok(savedItem); // 200 OK
    }

    // View an item by ID
    @GetMapping("/viewItem/{itemID}")
    public ResponseEntity<Item> viewItem(@PathVariable Long itemID) {
        Optional<Item> item = Optional.ofNullable(itemRepo.findByItemID(itemID));
        if (item.isEmpty()) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
        return ResponseEntity.ok(item.get()); // 200 OK
    }

    // Delete an item by ID
    @DeleteMapping("/deleteItem/{itemID}")
    public ResponseEntity<String> deleteItem(@PathVariable Long itemID) {
        Item existingItem = itemRepo.findByItemID(itemID);
        if (existingItem == null) {
            return (ResponseEntity<String>) ResponseEntity.notFound(); // 404 Not Found
        }
        itemRepo.delete(existingItem);
        return ResponseEntity.ok("Item successfully deleted"); // 200 OK
    }

    // Update an item by ID
    @PutMapping("/updateItem/{itemID}")
    public ResponseEntity<Item> updateItem(
            @PathVariable Long itemID,
            @RequestBody Item itemDetails
    ) {
        Item existingItem = itemRepo.findByItemID(itemID);
        if (existingItem == null) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }

        // Update fields
        existingItem.setItemName(itemDetails.getItemName());
        existingItem.setItemQuantity(itemDetails.getItemQuantity());
        existingItem.setItemPrice(itemDetails.getItemPrice());
        existingItem.setManufactureDate(itemDetails.getManufactureDate());
        existingItem.setExpDate(itemDetails.getExpDate());
        existingItem.setStatus(itemDetails.getStatus());
        existingItem.setBranch(itemDetails.getBranch());

        Item updatedItem = itemRepo.save(existingItem);
        return ResponseEntity.ok(updatedItem); // 200 OK
    }
}
