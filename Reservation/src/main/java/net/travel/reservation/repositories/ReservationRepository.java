package net.travel.reservation.repositories;

import net.travel.reservation.entites.Reservation;
import net.travel.reservation.entites.StatutReservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Trouver une réservation par son numéro unique (ex: RES-2026-001)
    Optional<Reservation> findByNumeroReservation(String numeroReservation);

    // Trouver par token de portail client

    // 📌 Vérifier si UNE SALLE PRÉCISE est déjà réservée à une date donnée
    boolean existsBySalleSalleIdAndDate(Long salleId, LocalDate date);

    // 📌 Vérifier la disponibilité en ignorant les réservations annulées
    boolean existsBySalleSalleIdAndDateAndStatutNot(Long salleId, LocalDate date, StatutReservation statut);

    // Toutes les réservations d'une salle spécifique
    List<Reservation> findBySalleSalleId(Long salleId);

    // Toutes les réservations d'un client
    List<Reservation> findByClientClientId(Long clientId);

    // Planning : toutes les réservations pour une date donnée
    List<Reservation> findByDate(LocalDate date);

    boolean existsByDate(LocalDate date);

    // 🔍 Récupère les réservations actives pour une salle à une date donnée
    List<Reservation> findBySalleSalleIdAndDateAndStatutNot(Long salleId, LocalDate date, StatutReservation statut);


    Page<Reservation> findByClientClientId(
            Long clientId,
            Pageable pageable
    );
}





