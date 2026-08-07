package net.travel.reservation.controller;

import net.travel.reservation.entites.Espace;
import net.travel.reservation.services.EspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/espaces")
@CrossOrigin(origins = "*")
public class EspaceController {

    @Autowired
    private EspaceService espaceService;

    @PostMapping
    public ResponseEntity<?> creerEspace(@RequestBody Espace espace) {
        try {
            Espace nouveauEspace = espaceService.creerEspace(espace);
            return new ResponseEntity<>(nouveauEspace, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Espace>> listerTousLesEspaces() {
        List<Espace> espaces = espaceService.listerTousLesEspaces();
        return ResponseEntity.ok(espaces);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Espace> trouverEspaceParId(@PathVariable Long id) {
        return espaceService.trouverEspaceParId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modifierEspace(@PathVariable Long id, @RequestBody Espace espaceDetails) {
        try {
            Espace espaceMisAJour = espaceService.modifierEspace(id, espaceDetails);
            return ResponseEntity.ok(espaceMisAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerEspace(@PathVariable Long id) {
        try {
            espaceService.supprimerEspace(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/ville/{ville}")
    public ResponseEntity<List<Espace>> trouverEspacesParVille(@PathVariable String ville) {
        List<Espace> espaces = espaceService.trouverEspacesParVille(ville);
        return ResponseEntity.ok(espaces);
    }

    // Endpoint de recherche globale par mot-clé (nom ou ville) -> /api/espaces/search?keyword=...
    @GetMapping("/search")
    public ResponseEntity<List<Espace>> rechercherEspaces(@RequestParam String keyword) {
        List<Espace> espaces = espaceService.rechercherEspaces(keyword);
        return ResponseEntity.ok(espaces);
    }

    // ✅ AJOUT : Récupérer l'espace et ses salles par l'ID de l'utilisateur -> /api/espaces/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<Espace> trouverEspaceParUserId(@PathVariable Long userId) {
        return espaceService.trouverEspaceParId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}