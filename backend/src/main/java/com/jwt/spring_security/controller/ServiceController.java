package com.jwt.spring_security.controller;

import com.jwt.spring_security.DTO.ItemDTO;
import com.jwt.spring_security.DTO.RenderedServiceDTO;
import com.jwt.spring_security.DTO.ServiceDTO;
import com.jwt.spring_security.model.*;
import com.jwt.spring_security.repo.ItemRepo;
import com.jwt.spring_security.repo.PatientRepo;
import com.jwt.spring_security.repo.RenderedServiceRepository;
import com.jwt.spring_security.repo.ServiceRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/service")
public class ServiceController {

    @Autowired
    private RenderedServiceRepository renderedServiceRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ItemRepo itemRepo;

    @Autowired
    private PatientRepo patientRepo;

    @Autowired
    private ServiceRepository servicesRepo;


    @PostMapping("/addService")
    public ResponseEntity<?> addService(@RequestBody Services services) {
        try {
            serviceRepository.save(services);
            return ResponseEntity.ok("Service added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/getServices")
    public ResponseEntity<?> getServices() {
        try {
            return ResponseEntity.ok(serviceRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/deleteService/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        try {
            serviceRepository.deleteById(id);
            return ResponseEntity.ok("Service deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/updateService")
    public ResponseEntity<?> updateService(@RequestBody Services services) {
        try {
            serviceRepository.save(services);
            return ResponseEntity.ok("Service updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @Transactional
    @PostMapping("/renderService")
    public ResponseEntity<?> renderService(@RequestBody RenderedService request) {
        try {
            System.out.println("Received RenderedService: " + request);

            // Validate and fetch patient details
            Patient patient = request.getPatient();
            if (patient == null || patient.getPatientID() == null) {
                return ResponseEntity.badRequest().body("Patient information is required.");
            }

            Patient existingPatient = patientRepo.findByPatientID(patient.getPatientID())
                    .orElseThrow(() -> new RuntimeException("Patient not found: " + patient.getPatientID()));

            // Validate and fetch services
            List<Services> services = request.getServices();
            if (services == null || services.isEmpty()) {
                return ResponseEntity.badRequest().body("At least one service must be selected.");
            }

            List<Services> managedServices = new ArrayList<>();
            for (Services service : services) {
                if (service.getServiceID() == null) {
                    return ResponseEntity.badRequest().body("Service ID cannot be null.");
                }
                Services existingService = servicesRepo.findById(service.getServiceID())
                        .orElseThrow(() -> new RuntimeException("Service not found: " + service.getServiceID()));
                managedServices.add(existingService);
            }

            // Validate and update item quantities (if applicable)
            List<Item> items = request.getItems();
            if (items != null) {
                for (Item item : items) {
                    if (item.getItemID() == null) {
                        return ResponseEntity.badRequest().body("Item ID cannot be null.");
                    }

                    Item existingItem = itemRepo.findByItemID(item.getItemID());
                    if (existingItem == null) {
                        return ResponseEntity.badRequest().body("Item not found: " + item.getItemID());
                    }
                    if (existingItem.getItemStock() == null || item.getItemQuantity() == null) {
                        return ResponseEntity.badRequest().body("Item quantities must not be null.");
                    }
                    if (existingItem.getItemStock() < item.getItemQuantity()) {
                        return ResponseEntity.badRequest().body("Insufficient stock for item: " + existingItem.getItemName());
                    }

                    // Update the quantity
                    existingItem.setItemStock(existingItem.getItemStock() - item.getItemQuantity());

                    // Save and flush the item to ensure persistence
                    itemRepo.saveAndFlush(existingItem);
                }
            }

            // Save rendered service details
            RenderedService renderedService = new RenderedService();
            renderedService.setPatient(existingPatient);
            renderedService.setServices(managedServices);
            renderedService.setItems(items);
            renderedService.setTotalCost(request.getTotalCost());
            renderedService.setNotes(request.getNotes());
            renderedService.setServiceDate(request.getServiceDate());

            RenderedService savedService = renderedServiceRepository.save(renderedService);

            return ResponseEntity.ok("Service rendered successfully with ID: " + savedService.getId());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
        }
    }


    @GetMapping("/getRenderedServicesByPatientId/{patientId}")
    public ResponseEntity<?> getRenderedServicesByPatientId(@PathVariable Long patientId) {
        List<RenderedService> renderedServices = renderedServiceRepository.findByPatientId(patientId);

        if (renderedServices.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No rendered services found for patient ID: " + patientId);
        }
        

        // Map each RenderedService to RenderedServiceDTO
        List<RenderedServiceDTO> dtoList = new ArrayList<>();
        for (RenderedService rs : renderedServices) {
            RenderedServiceDTO dto = new RenderedServiceDTO();
            dto.setId(rs.getId());
            dto.setPatientId(rs.getPatient().getClientID()); // only store patient's ID
            dto.setTotalCost(rs.getTotalCost());
            dto.setNotes(rs.getNotes());
            dto.setServiceDate(rs.getServiceDate());



            // Map services
            List<ServiceDTO> serviceDTOs = new ArrayList<>();
            if (rs.getServices() != null) {
                for (Services service : rs.getServices()) {
                    ServiceDTO sdto = new ServiceDTO();
                    sdto.setServiceID(service.getServiceID());
                    sdto.setServiceName(service.getService_name());
                    sdto.setServiceDescription(service.getService_description());
                    sdto.setServicePrice(service.getService_price());
                    serviceDTOs.add(sdto);
                }
            }
            dto.setServices(serviceDTOs);

            // Map items
            List<ItemDTO> itemDTOs = new ArrayList<>();
            if (rs.getItems() != null) {
                for (Item item : rs.getItems()) {
                    ItemDTO idto = new ItemDTO();
                    idto.setItemID(item.getItemID());
                    idto.setItemName(item.getItemName());
                    idto.setItemQuantity(item.getItemQuantity());
                    idto.setItemPrice(item.getItemPrice());
                    itemDTOs.add(idto);
                }
            }
            dto.setItems(itemDTOs);

            dtoList.add(dto);
        }

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/getRenderedServices")
    public ResponseEntity<?> getRenderedServices() {
        List<RenderedService> renderedServices = renderedServiceRepository.findAll();

        if (renderedServices.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No rendered services found.");
        }

        // Map each RenderedService to RenderedServiceDTO
        List<RenderedServiceDTO> dtoList = new ArrayList<>();
        for (RenderedService rs : renderedServices) {
            RenderedServiceDTO dto = new RenderedServiceDTO();
            dto.setId(rs.getId());
            dto.setPatientId(rs.getPatient().getClientID()); // only store patient's ID
            dto.setTotalCost(rs.getTotalCost());
            dto.setNotes(rs.getNotes());

            // Map services
            List<ServiceDTO> serviceDTOs = new ArrayList<>();
            if (rs.getServices() != null) {
                for (Services service : rs.getServices()) {
                    ServiceDTO sdto = new ServiceDTO();
                    sdto.setServiceID(service.getServiceID());
                    sdto.setServiceName(service.getService_name());
                    sdto.setServiceDescription(service.getService_description());
                    sdto.setServicePrice(service.getService_price());
                    serviceDTOs.add(sdto);
                }
            }
            dto.setServices(serviceDTOs);

            // Map items
            List<ItemDTO> itemDTOs = new ArrayList<>();
            if (rs.getItems() != null) {
                for (Item item : rs.getItems()) {
                    ItemDTO idto = new ItemDTO();
                    idto.setItemID(item.getItemID());
                    idto.setItemName(item.getItemName());
                    idto.setItemQuantity(item.getItemQuantity());
                    idto.setItemPrice(item.getItemPrice());
                    itemDTOs.add(idto);
                }
            }
            dto.setItems(itemDTOs);

            dtoList.add(dto);
        }

        return ResponseEntity.ok(dtoList);
    }







}

