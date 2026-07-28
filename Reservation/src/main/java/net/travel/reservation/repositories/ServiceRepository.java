package net.travel.reservation.repositories;

import net.travel.reservation.entites.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {

    // Trouver tous les services associés à une salle spécifique
    List<Service> findBySalleSalleId(Long salleId);



    // Rechercher un service par son nom (ex: "DJ", "Décoration")
    List<Service> findByNomContainingIgnoreCase(String nom);
}