package net.travel.reservation.services;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Service;
import net.travel.reservation.repositories.ServiceRepository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ServiceService {

    private final ServiceRepository serviceRepository;

    // --- Read (All) ---
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    // --- Read (By ID) ---
    public Service getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service introuvable avec l'ID : " + id));
    }

    // --- Read (By Salle ID) ---
    public List<Service> getServicesBySalleId(Long salleId) {
        return serviceRepository.findBySalleSalleId(salleId);
    }

    // --- Create ---
    @Transactional
    public Service createService(Service service) {
        if (service.getPrix() == null || service.getPrix().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Le prix du service doit être supérieur ou égal à zéro");
        }
        return serviceRepository.save(service);
    }

    // --- Update ---
    @Transactional
    public Service updateService(Long id, Service serviceRequest) {
        Service service = getServiceById(id);

        if (serviceRequest.getPrix() != null && serviceRequest.getPrix().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Le prix du service ne peut pas être négatif");
        }

        service.setNom(serviceRequest.getNom());
        service.setDescription(serviceRequest.getDescription());
        service.setPrix(serviceRequest.getPrix());
        service.setCategorie(serviceRequest.getCategorie());
        service.setStatut(serviceRequest.getStatut());

        if (serviceRequest.getSalle() != null) {
            service.setSalle(serviceRequest.getSalle());
        }

        return serviceRepository.save(service);
    }

    // --- Delete ---
    @Transactional
    public void deleteService(Long id) {
        Service service = getServiceById(id);
        serviceRepository.delete(service);
    }
}