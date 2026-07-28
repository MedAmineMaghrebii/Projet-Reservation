package net.travel.reservation.controller;
import net.travel.reservation.dto.ServiceDTO;
import net.travel.reservation.services.ServiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }
    @PostMapping
    public ResponseEntity<ServiceDTO> createService(@RequestBody ServiceDTO serviceDTO) {
        ServiceDTO createdService = serviceService.createService(serviceDTO);
        return new ResponseEntity<>(createdService, HttpStatus.CREATED);
    }

    // --- READ ALL ---
    // GET /api/services
    @GetMapping
    public ResponseEntity<List<ServiceDTO>> getAllServices() {
        List<ServiceDTO> services = serviceService.getAllServices();
        return ResponseEntity.ok(services);
    }

    // --- READ BY ID ---
    // GET /api/services/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ServiceDTO> getServiceById(@PathVariable Long id) {
        ServiceDTO service = serviceService.getServiceById(id);
        return ResponseEntity.ok(service);
    }

    // --- READ BY SALLE ID ---
    // GET /api/services/salle/{salleId}
    @GetMapping("/salle/{salleId}")
    public ResponseEntity<List<ServiceDTO>> getServicesBySalleId(@PathVariable Long salleId) {
        List<ServiceDTO> services = serviceService.getServicesBySalleId(salleId);
        return ResponseEntity.ok(services);
    }

    // --- UPDATE ---

    @PutMapping("/{id}")
    public ResponseEntity<ServiceDTO> updateService(@PathVariable Long id, @RequestBody ServiceDTO serviceDTO) {
        ServiceDTO updatedService = serviceService.updateService(id, serviceDTO);
        return ResponseEntity.ok(updatedService);
    }

    // --- DELETE ---
    // DELETE /api/services/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
