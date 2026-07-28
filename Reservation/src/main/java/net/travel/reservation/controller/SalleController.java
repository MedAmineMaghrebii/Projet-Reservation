package net.travel.reservation.controller;


import lombok.RequiredArgsConstructor;
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


    // Récupérer toutes les salles
    @GetMapping
    public ResponseEntity<List<Salle>> getAllSalles() {

        return ResponseEntity.ok(salleService.getAllSalles());
    }


    // Récupérer une salle par ID
    @GetMapping("/{id}")
    public ResponseEntity<Salle> getSalleById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                salleService.getSalleById(id)
        );
    }


    // Ajouter une salle
    @PostMapping
    public ResponseEntity<Salle> createSalle(
            @RequestBody Salle salle) {

        Salle nouvelleSalle = salleService.createSalle(salle);

        return new ResponseEntity<>(
                nouvelleSalle,
                HttpStatus.CREATED
        );
    }


    // Modifier une salle
    @PutMapping("/{id}")
    public ResponseEntity<Salle> updateSalle(
            @PathVariable Long id,
            @RequestBody Salle salle) {

        return ResponseEntity.ok(
                salleService.updateSalle(id, salle)
        );
    }


    // Supprimer une salle
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalle(
            @PathVariable Long id) {

        salleService.deleteSalle(id);

        return ResponseEntity.noContent().build();
    }


    // Rechercher les salles par ville
    @GetMapping("/ville/{ville}")
    public ResponseEntity<List<Salle>> findByVille(
            @PathVariable String ville) {

        return ResponseEntity.ok(
                salleService.findByVille(ville)
        );
    }


    // Rechercher les salles par capacité
    @GetMapping("/capacite/{capacite}")
    public ResponseEntity<List<Salle>> findByCapacite(
            @PathVariable Integer capacite) {

        return ResponseEntity.ok(
                salleService.findByCapacite(capacite)
        );
    }


    // Recherche par ville et capacité
    @GetMapping("/recherche")
    public ResponseEntity<List<Salle>> rechercherSalleDisponible(

            @RequestParam String ville,
            @RequestParam Integer capacite) {

        return ResponseEntity.ok(

                salleService.rechercherSalleDisponible(
                        ville,
                        capacite
                )
        );
    }

}
