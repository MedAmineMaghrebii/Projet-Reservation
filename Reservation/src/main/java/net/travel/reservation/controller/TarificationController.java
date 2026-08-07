package net.travel.reservation.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.travel.reservation.dto.ApiResponse;
import net.travel.reservation.entites.TarificationSalle;
import net.travel.reservation.services.TarificationSalleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TarificationController {

    private final TarificationSalleService tarificationSalleService;

    // --- Récupérer toutes les tarifications ---
    @GetMapping
    public ResponseEntity<List<TarificationSalle>> getAllTarifications() {
        return ResponseEntity.ok(tarificationSalleService.getAllTarifications());
    }

    // --- Récupérer par ID ---
    @GetMapping("/{id}")
    public ResponseEntity<TarificationSalle> getTarificationById(@PathVariable Long id) {
        return ResponseEntity.ok(tarificationSalleService.getTarificationById(id));
    }

    // --- Récupérer les tarifications d'une salle ---
    @GetMapping("/salle/{salleId}")
    public ResponseEntity<List<TarificationSalle>> getTarificationsBySalleId(@PathVariable Long salleId) {
        return ResponseEntity.ok(tarificationSalleService.findBySalleId(salleId));
    }

    // --- Créer une tarification ---
    @PostMapping
    public ResponseEntity<ApiResponse<TarificationSalle>> createTarification(
            @Valid @RequestBody TarificationSalle tarification) {

        TarificationSalle nouvelleTarification =
                tarificationSalleService.createTarification(tarification);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        HttpStatus.CREATED.value(),
                        "Tarification créée avec succès",
                        nouvelleTarification
                ));
    }


    // --- Modifier une tarification ---
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TarificationSalle>> updateTarification(
            @PathVariable Long id,
            @Valid @RequestBody TarificationSalle tarification) {

        TarificationSalle tarificationModifiee =
                tarificationSalleService.updateTarification(id, tarification);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Tarification modifiée avec succès",
                        tarificationModifiee
                )
        );
    }


    // --- Supprimer une tarification ---
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTarification(
            @PathVariable Long id) {

        tarificationSalleService.deleteTarification(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Tarification supprimée avec succès",
                        null
                )
        );
    }
}