package net.travel.reservation.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Log;
import net.travel.reservation.services.LogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LogController {

    private final LogService logService;

    // --- Récupérer tous les logs ---
    @GetMapping
    public ResponseEntity<List<Log>> getAllLogs() {
        return ResponseEntity.ok(logService.getAllLogs());
    }

    // --- Récupérer un log par ID ---
    @GetMapping("/{id}")
    public ResponseEntity<Log> getLogById(@PathVariable Long id) {
        return ResponseEntity.ok(logService.getLogById(id));
    }

    // --- Logs par ID d'utilisateur (Corrigé) ---
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Log>> getLogsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(logService.getLogsByUserId(userId));
    }

    // --- Logs par action (ex: CREATE, UPDATE, DELETE) ---
    @GetMapping("/action/{action}")
    public ResponseEntity<List<Log>> getLogsByAction(@PathVariable String action) {
        return ResponseEntity.ok(logService.getLogsByAction(action));
    }

    // --- Logs par entité (ex: Reservation, Client) ---
    @GetMapping("/entite/{entite}")
    public ResponseEntity<List<Log>> getLogsByEntite(@PathVariable String entite) {
        return ResponseEntity.ok(logService.getLogsByEntite(entite));
    }

    // --- Historique d'un objet précis (ex: Reservation #10) ---
    @GetMapping("/historique/{entite}/{entiteId}")
    public ResponseEntity<List<Log>> getHistoriqueObjet(
            @PathVariable String entite,
            @PathVariable Long entiteId) {
        return ResponseEntity.ok(logService.getHistoriqueObjet(entite, entiteId));
    }

    // --- Créer un log manuel (si vraiment nécessaire pour ton besoin) ---
    @PostMapping
    public ResponseEntity<Log> createLog(@Valid @RequestBody Log log) {
        Log nouveauLog = logService.createLog(log);
        return new ResponseEntity<>(nouveauLog, HttpStatus.CREATED);
    }

    // --- Supprimer un log (à réserver aux ADMINS si conservé) ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(@PathVariable Long id) {
        logService.deleteLog(id);
        return ResponseEntity.noContent().build();
    }
}