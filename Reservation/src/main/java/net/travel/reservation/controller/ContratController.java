package net.travel.reservation.controller;
import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Contrat;
import net.travel.reservation.entites.StatutContrat;
import net.travel.reservation.services.ContratService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/contrats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContratController {


    private final ContratService contratService;



    // Récupérer tous les contrats
    @GetMapping
    public ResponseEntity<List<Contrat>> getAllContrats() {

        return ResponseEntity.ok(
                contratService.getAllContrats()
        );
    }





    // Récupérer un contrat par ID
    @GetMapping("/{id}")
    public ResponseEntity<Contrat> getContratById(
            @PathVariable UUID id) {


        return ResponseEntity.ok(
                contratService.getContratById(id)
        );
    }





    // Créer un contrat
    @PostMapping
    public ResponseEntity<Contrat> createContrat(
            @RequestBody Contrat contrat) {


        Contrat nouveauContrat =
                contratService.createContrat(contrat);


        return new ResponseEntity<>(
                nouveauContrat,
                HttpStatus.CREATED
        );
    }





    // Modifier un contrat
    @PutMapping("/{id}")
    public ResponseEntity<Contrat> updateContrat(
            @PathVariable UUID id,
            @RequestBody Contrat contrat) {


        return ResponseEntity.ok(
                contratService.updateContrat(
                        id,
                        contrat
                )
        );
    }





    // Modifier le statut
    @PutMapping("/{id}/statut")
    public ResponseEntity<Contrat> updateStatut(
            @PathVariable UUID id,
            @RequestParam StatutContrat statut) {


        return ResponseEntity.ok(
                contratService.updateStatut(
                        id,
                        statut
                )
        );
    }





    // Chercher par numéro contrat
    @GetMapping("/numero/{numero}")
    public ResponseEntity<Contrat> getByNumeroContrat(
            @PathVariable String numero) {


        return ResponseEntity.ok(
                contratService.getByNumeroContrat(numero)
        );
    }





    // Contrats signés
    @GetMapping("/signes")
    public ResponseEntity<List<Contrat>> getContratsSignes() {


        return ResponseEntity.ok(
                contratService.getContratsSignes()
        );
    }





    // Supprimer un contrat
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContrat(
            @PathVariable UUID id) {


        contratService.deleteContrat(id);


        return ResponseEntity.noContent().build();
    }

}
