package net.travel.reservation.repositories;

import net.travel.reservation.entites.StatutTransaction;
import net.travel.reservation.entites.Transaction;
import net.travel.reservation.entites.TypeTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Toutes les transactions d'une réservation
    List<Transaction> findByReservationReservationId(Long reservationId);

    // Transactions par statut
    List<Transaction> findByStatut(StatutTransaction statut);

    // Transactions par type
    List<Transaction> findByType(TypeTransaction type);

    // Transactions d'une réservation avec un statut
    List<Transaction> findByReservationReservationIdAndStatut(
            Long reservationId,
            StatutTransaction statut
    );

    // Transactions d'une réservation avec un type
    List<Transaction> findByReservationReservationIdAndType(
            Long reservationId,
            TypeTransaction type
    );
}
