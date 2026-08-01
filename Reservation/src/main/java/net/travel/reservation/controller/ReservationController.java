package net.travel.reservation.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Reservation;
import net.travel.reservation.entites.User;
import net.travel.reservation.repositories.UserRepository;
import net.travel.reservation.services.ReservationService;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;
    private final UserRepository userRepository;

    // --- Récupérer toutes les réservations ---
    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }


    @GetMapping("/client/{clientId}")
    public ResponseEntity<Page<Reservation>> getReservationsByClient(
            @PathVariable Long clientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {

        return ResponseEntity.ok(
                reservationService.getReservationHistory(clientId, page, size)
        );
    }
    // --- Récupérer une réservation par ID ---
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    // --- Ajouter une réservation (Standard REST : POST /api/reservations) ---
    @PostMapping
    public ResponseEntity<Reservation> createReservation(@Valid @RequestBody Reservation reservation) {

        // 1. Récupérer l'email (username) du JWT dans le SecurityContext
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Charger l'utilisateur courant depuis la BDD
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'email : " + email));

        // 3. Assigner l'auteur de la création
        reservation.setCreePar(currentUser);

        // 4. Sauvegarder la réservation et ses paiements associés (grâce à @Transactional)
        Reservation nouvelleReservation = reservationService.createReservation(reservation);

        return new ResponseEntity<>(nouvelleReservation, HttpStatus.CREATED);
    }

    // --- Modifier une réservation ---
    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(
            @PathVariable Long id,
            @Valid @RequestBody Reservation reservation) {

        return ResponseEntity.ok(reservationService.updateReservation(id, reservation));
    }

    // --- Supprimer une réservation ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }

    // --- Rechercher les réservations par date ---
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Reservation>> findByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return ResponseEntity.ok(reservationService.findByDate(date));
    }

    // --- Vérifier si une réservation existe à une date ---
    @GetMapping("/exists/{date}")
    public ResponseEntity<Boolean> existsReservationByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return ResponseEntity.ok(reservationService.existsReservationByDate(date));
    }
}