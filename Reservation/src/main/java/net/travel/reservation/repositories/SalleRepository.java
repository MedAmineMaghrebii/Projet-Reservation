package net.travel.reservation.repositories;


import net.travel.reservation.entites.Salle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface SalleRepository extends JpaRepository<Salle, Long> {


    boolean existsByEmail(String email);


    List<Salle> findByVilleAndCapaciteMaxGreaterThanEqual(String ville, Integer capacite);

    List<Salle> findByCapaciteMaxGreaterThanEqual(Integer capacite);

    List<Salle> findByVille(String ville);

    boolean existsByNom(String nom);
}
