package net.travel.reservation.controller;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Paiement;
import net.travel.reservation.services.PaiementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/paiements")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaiementController {

    private final PaiementService paiementService;


    // Récupérer tous les paiements
    @GetMapping
    public ResponseEntity<List<Paiement>> getAllPaiements() {

        return ResponseEntity.ok(
                paiementService.getAllPaiements()
        );
    }


    // Récupérer un paiement par ID
    @GetMapping("/{id}")
    public ResponseEntity<Paiement> getPaiementById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                paiementService.getPaiementById(id)
        );
    }


    // Ajouter un paiement
    @PostMapping
    public ResponseEntity<Paiement> createPaiement(
            @RequestBody Paiement paiement) {

        Paiement nouveauPaiement =
                paiementService.createPaiement(paiement);

        return new ResponseEntity<>(
                nouveauPaiement,
                HttpStatus.CREATED
        );
    }


    // Modifier un paiement
    @PutMapping("/{id}")
    public ResponseEntity<Paiement> updatePaiement(
            @PathVariable UUID id,
            @RequestBody Paiement paiement) {

        return ResponseEntity.ok(
                paiementService.updatePaiement(id, paiement)
        );
    }


    // Supprimer un paiement
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaiement(
            @PathVariable UUID id) {

        paiementService.deletePaiement(id);

        return ResponseEntity.noContent().build();
    }


    // Paiements d'une réservation
    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<List<Paiement>> getPaiementsByReservation(
            @PathVariable Long reservationId) {

        return ResponseEntity.ok(
                paiementService.getPaiementsByReservation(reservationId)
        );
    }


    // Total payé pour une réservation
    @GetMapping("/reservation/{reservationId}/total")
    public ResponseEntity<BigDecimal> calculerTotalPaye(
            @PathVariable Long reservationId) {

        return ResponseEntity.ok(
                paiementService.calculerTotalPaye(reservationId)
        );
    }

}
