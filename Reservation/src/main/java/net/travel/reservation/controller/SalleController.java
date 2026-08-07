package net.travel.reservation.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.travel.reservation.dto.ApiResponse;
import net.travel.reservation.entites.Salle;
import net.travel.reservation.services.SalleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SalleController {

    private final SalleService salleService;

    // --- Récupérer toutes les salles ---
    @GetMapping
    public ResponseEntity<List<Salle>> getAllSalles() {
        return ResponseEntity.ok(salleService.getAllSalles());
    }

    // --- ✅ AJOUT : Récupérer les salles de l'espace de l'utilisateur connecté ---
    @GetMapping("/my-salles")
    public ResponseEntity<List<Salle>> getSallesByConnectedUser() {
        return ResponseEntity.ok(salleService.getSallesByConnectedUser());
    }

    // --- Récupérer une salle par ID ---
    @GetMapping("/{id}")
    public ResponseEntity<Salle> getSalleById(@PathVariable Long id) {
        return ResponseEntity.ok(salleService.getSalleById(id));
    }

    // --- Ajouter une salle ---
    @PostMapping
    public ResponseEntity<ApiResponse<Salle>> createSalle(
            @Valid @RequestBody Salle salle) {

        Salle nouvelleSalle = salleService.createSalle(salle);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        HttpStatus.CREATED.value(),
                        "Salle créée avec succès",
                        nouvelleSalle
                ));
    }

    // --- Modifier une salle ---
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Salle>> updateSalle(
            @PathVariable Long id,
            @Valid @RequestBody Salle salle) {

        Salle salleModifiee = salleService.updateSalle(id, salle);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Salle modifiée avec succès",
                        salleModifiee
                )
        );
    }

    // --- Supprimer une salle ---
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSalle(
            @PathVariable Long id) {

        salleService.deleteSalle(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Salle supprimée avec succès",
                        null
                )
        );
    }
    // --- Rechercher les salles par ville ---
    @GetMapping("/ville/{ville}")
    public ResponseEntity<List<Salle>> findByVille(@PathVariable String ville) {
        return ResponseEntity.ok(salleService.findByVille(ville));
    }

    // --- Rechercher les salles par capacité minimale ---
    @GetMapping("/capacite/{capacite}")
    public ResponseEntity<List<Salle>> findByCapacite(@PathVariable Integer capacite) {
        return ResponseEntity.ok(salleService.findByCapacite(capacite));
    }

    // --- Recherche avancée par ville et capacité ---
    @GetMapping("/recherche")
    public ResponseEntity<List<Salle>> rechercherSalleDisponible(
            @RequestParam String ville,
            @RequestParam Integer capacite) {
        return ResponseEntity.ok(salleService.rechercherSalleDisponible(ville, capacite));
    }
}