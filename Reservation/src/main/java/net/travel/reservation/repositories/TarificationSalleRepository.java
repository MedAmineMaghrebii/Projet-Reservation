package net.travel.reservation.repositories;

import net.travel.reservation.entites.TarificationSalle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TarificationSalleRepository extends JpaRepository<TarificationSalle, Long> {

    // Spring traverses the 'salle' relationship and matches 'salleId' on the Salle entity
    List<TarificationSalle> findBySalle_SalleId(Long salleId);

}