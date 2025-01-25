package com.jwt.spring_security.service;

import com.jwt.spring_security.model.Branch;
import com.jwt.spring_security.model.Item;
import com.jwt.spring_security.repo.ItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {

    @Autowired
    ItemRepo itemRepo;


    public ResponseEntity<String> deleteByItemIDs(List<Long> itemIDs) {
        if (itemIDs == null || itemIDs.isEmpty()) {
            return ResponseEntity.badRequest().body("No item IDs provided.");
        }

        // Find items in the database by provided IDs
        List<Item> itemsToDelete = itemRepo.findAllById(itemIDs);

        if (itemsToDelete.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No items were found for the provided IDs.");
        }

        try {
            // Delete the identified items
            itemRepo.deleteAll(itemsToDelete);
            return ResponseEntity.ok().body("Items deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting items.");
        }
    }

    public ResponseEntity<String> softDeleteByItemIDs(List<Long> itemIDs) {
        if (itemIDs == null || itemIDs.isEmpty()) {
            return ResponseEntity.badRequest().body("No item IDs provided.");
        }

        // Find items in the database by provided IDs
        List<Item> itemsToDelete = itemRepo.findAllById(itemIDs);

        if (itemsToDelete.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No items were found for the provided IDs.");
        }

        try {
            // Soft delete the identified items
            itemsToDelete.forEach(item -> item.setDeleted(true));
            itemRepo.saveAll(itemsToDelete);
            return ResponseEntity.ok().body("Items soft deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while soft deleting items.");
        }
    }

    public ResponseEntity<List<Item>> getAllActiveItems() {
        return ResponseEntity.ok(itemRepo.findByDeletedFalse());
    }



}
