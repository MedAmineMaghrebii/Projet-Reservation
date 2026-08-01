package net.travel.reservation.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Service;
import net.travel.reservation.services.ServiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ServiceController {

    private final ServiceService serviceService;

    // --- CREATE ---
    @PostMapping
    public ResponseEntity<Service> createService(@Valid @RequestBody Service service) {
        Service createdService = serviceService.createService(service);
        return new ResponseEntity<>(createdService, HttpStatus.CREATED);
    }

    // --- READ ALL ---
    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    // --- READ BY ID ---
    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }

    // --- READ BY SALLE ID ---
    @GetMapping("/salle/{salleId}")
    public ResponseEntity<List<Service>> getServicesBySalleId(@PathVariable Long salleId) {
        return ResponseEntity.ok(serviceService.getServicesBySalleId(salleId));
    }

    // --- UPDATE ---
    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(
            @PathVariable Long id,
            @Valid @RequestBody Service service) {
        return ResponseEntity.ok(serviceService.updateService(id, service));
    }

    // --- DELETE ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}