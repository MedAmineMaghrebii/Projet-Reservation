package net.travel.reservation.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.travel.reservation.dto.PaiementRequestDTO;
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

    @GetMapping
    public ResponseEntity<List<Paiement>> getAllPaiements() {
        return ResponseEntity.ok(paiementService.getAllPaiements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paiement> getPaiementById(@PathVariable UUID id) {
        return ResponseEntity.ok(paiementService.getPaiementById(id));
    }

    @PostMapping
    public ResponseEntity<Paiement> createPaiement(@Valid @RequestBody PaiementRequestDTO dto) {
        Paiement nouveauPaiement = paiementService.createPaiement(dto);
        return new ResponseEntity<>(nouveauPaiement, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paiement> updatePaiement(
            @PathVariable UUID id,
            @Valid @RequestBody Paiement paiement) {
        return ResponseEntity.ok(paiementService.updatePaiement(id, paiement));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaiement(@PathVariable UUID id) {
        paiementService.deletePaiement(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<List<Paiement>> getPaiementsByReservation(@PathVariable Long reservationId) {
        return ResponseEntity.ok(paiementService.getPaiementsByReservation(reservationId));
    }

    @GetMapping("/reservation/{reservationId}/total")
    public ResponseEntity<BigDecimal> calculerTotalPaye(@PathVariable Long reservationId) {
        return ResponseEntity.ok(paiementService.calculerTotalPaye(reservationId));
    }
}