package net.travel.reservation.services;



import net.travel.reservation.dto.ServiceDTO;
import net.travel.reservation.entites.Salle;
import net.travel.reservation.entites.Service;
import net.travel.reservation.repositories.SalleRepository;
import net.travel.reservation.repositories.ServiceRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@Transactional
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final SalleRepository salleRepository;

    public ServiceService(ServiceRepository serviceRepository, SalleRepository salleRepository) {
        this.serviceRepository = serviceRepository;
        this.salleRepository = salleRepository;
    }

    // --- Create ---
    public ServiceDTO createService(ServiceDTO serviceDTO) {
        Salle salle = salleRepository.findById(serviceDTO.getSalleId())
                .orElseThrow(() -> new RuntimeException("Salle introuvable avec l'ID : " + serviceDTO.getSalleId()));

        Service service = mapToEntity(serviceDTO, salle);
        Service savedService = serviceRepository.save(service);

        return mapToDTO(savedService);
    }

    // --- Read (By ID) ---
    @Transactional(readOnly = true)
    public ServiceDTO getServiceById(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service introuvable avec l'ID : " + id));
        return mapToDTO(service);
    }

    // --- Read (All) ---
    @Transactional(readOnly = true)
    public List<ServiceDTO> getAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // --- Read (By Salle ID) ---
    @Transactional(readOnly = true)
    public List<ServiceDTO> getServicesBySalleId(Long salleId) {
        return serviceRepository.findBySalleSalleId(salleId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // --- Update ---
    public ServiceDTO updateService(Long id, ServiceDTO serviceDTO) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service introuvable avec l'ID : " + id));

        Salle salle = salleRepository.findById(serviceDTO.getSalleId())
                .orElseThrow(() -> new RuntimeException("Salle introuvable avec l'ID : " + serviceDTO.getSalleId()));

        service.setNom(serviceDTO.getNom());
        service.setDescription(serviceDTO.getDescription());
        service.setPrix(serviceDTO.getPrix());
        service.setSalle(salle);

        Service updatedService = serviceRepository.save(service);
        return mapToDTO(updatedService);
    }

    // --- Delete ---
    public void deleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new RuntimeException("Impossible de supprimer : Service introuvable avec l'ID : " + id);
        }
        serviceRepository.deleteById(id);
    }

    // --- Mapping Helpers ---
    private ServiceDTO mapToDTO(Service entity) {
        return ServiceDTO.builder()
                .nom(entity.getNom())
                .description(entity.getDescription())
                .prix(entity.getPrix())
                .salleId(entity.getSalle() != null ? entity.getSalle().getSalleId() : null)
                .build();
    }

    private Service mapToEntity(ServiceDTO dto, Salle salle) {
        return Service.builder()
                .nom(dto.getNom())
                .description(dto.getDescription())
                .prix(dto.getPrix())
                .salle(salle)
                .build();
    }
}
