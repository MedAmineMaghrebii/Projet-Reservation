package net.travel.reservation.controller;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Reservation;
import net.travel.reservation.services.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;


    // Récupérer toutes les réservations
    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {

        return ResponseEntity.ok(
                reservationService.getAllReservations()
        );
    }


    // Récupérer une réservation par ID
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                reservationService.getReservationById(id)
        );
    }


    // Ajouter une réservation
    @PostMapping("/add")
    public ResponseEntity<Reservation> createReservation(
            @RequestBody Reservation reservation) {

        Reservation nouvelleReservation =
                reservationService.createReservation(reservation);

        return new ResponseEntity<>(
                nouvelleReservation,
                HttpStatus.CREATED
        );
    }


    // Modifier une réservation
    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(
            @PathVariable Long id,
            @RequestBody Reservation reservation) {

        return ResponseEntity.ok(
                reservationService.updateReservation(id, reservation)
        );
    }


    // Supprimer une réservation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(
            @PathVariable Long id) {

        reservationService.deleteReservation(id);

        return ResponseEntity.noContent().build();
    }


    // Rechercher les réservations par date
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Reservation>> findByDate(
            @PathVariable LocalDate date) {

        return ResponseEntity.ok(
                reservationService.findByDate(date)
        );
    }


    // Vérifier si une réservation existe à une date
    @GetMapping("/exists/{date}")
    public ResponseEntity<Boolean> existsReservationByDate(
            @PathVariable LocalDate date) {

        return ResponseEntity.ok(
                reservationService.existsReservationByDate(date)
        );
    }

}
