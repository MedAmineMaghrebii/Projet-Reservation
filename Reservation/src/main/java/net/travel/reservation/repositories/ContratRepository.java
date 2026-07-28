package net.travel.reservation.repositories;


import net.travel.reservation.entites.Contrat;
import net.travel.reservation.entites.StatutContrat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface ContratRepository
        extends JpaRepository<Contrat, UUID> {


    boolean existsByNumeroContrat(String numeroContrat);

    Optional<Object> findByNumeroContrat(String numero);

    List<Contrat> findByStatut(StatutContrat statut);
}
