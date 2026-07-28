package net.travel.reservation.repositories;

import net.travel.reservation.entites.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;


public interface PaiementRepository
        extends JpaRepository<Paiement, UUID> {


    List<Paiement> findByReservationReservationId(Long reservationId);


}