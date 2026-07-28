package net.travel.reservation.controller;


import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Log;
import net.travel.reservation.entites.User;
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



    // Récupérer tous les logs
    @GetMapping
    public ResponseEntity<List<Log>> getAllLogs() {

        return ResponseEntity.ok(
                logService.getAllLogs()
        );
    }





    // Récupérer un log par ID
    @GetMapping("/{id}")
    public ResponseEntity<Log> getLogById(
            @PathVariable Long id) {


        return ResponseEntity.ok(
                logService.getLogById(id)
        );
    }





    // Créer un log
    @PostMapping
    public ResponseEntity<Log> createLog(
            @RequestBody Log log) {


        Log nouveauLog =
                logService.createLog(log);


        return new ResponseEntity<>(
                nouveauLog,
                HttpStatus.CREATED
        );
    }





    // Logs par utilisateur
    @GetMapping("/utilisateur/{utilisateur}")
    public ResponseEntity<List<Log>> getLogsByUtilisateur(
            @PathVariable User utilisateur) {


        return ResponseEntity.ok(
                logService.getLogsByUtilisateur(utilisateur)
        );
    }





    // Logs par action
    @GetMapping("/action/{action}")
    public ResponseEntity<List<Log>> getLogsByAction(
            @PathVariable String action) {


        return ResponseEntity.ok(
                logService.getLogsByAction(action)
        );
    }





    // Logs par entité
    @GetMapping("/entite/{entite}")
    public ResponseEntity<List<Log>> getLogsByEntite(
            @PathVariable String entite) {


        return ResponseEntity.ok(
                logService.getLogsByEntite(entite)
        );
    }





    // Historique d'un objet précis
    // Exemple : tous les changements sur Reservation ID 10
    @GetMapping("/historique/{entite}/{entiteId}")
    public ResponseEntity<List<Log>> getHistoriqueObjet(
            @PathVariable String entite,
            @PathVariable Long entiteId) {


        return ResponseEntity.ok(
                logService.getHistoriqueObjet(
                        entite,
                        entiteId
                )
        );
    }





    // Supprimer un log
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(
            @PathVariable Long id) {


        logService.deleteLog(id);


        return ResponseEntity.noContent().build();
    }


}
