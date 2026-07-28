package net.travel.reservation.controller;
import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Client;
import net.travel.reservation.services.ClientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClientController {


    private final ClientService clientService;



    // Récupérer tous les clients
    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {


        return ResponseEntity.ok(
                clientService.getAllClients()
        );
    }





    // Récupérer un client par ID
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(
            @PathVariable Long id) {


        return ResponseEntity.ok(
                clientService.getClientById(id)
        );
    }





    // Ajouter un client
    @PostMapping
    public ResponseEntity<Client> createClient(
            @RequestBody Client client) {


        Client nouveauClient =
                clientService.createClient(client);


        return new ResponseEntity<>(
                nouveauClient,
                HttpStatus.CREATED
        );
    }





    // Modifier un client
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(
            @PathVariable Long id,
            @RequestBody Client client) {


        return ResponseEntity.ok(
                clientService.updateClient(
                        id,
                        client
                )
        );
    }





    // Supprimer un client
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(
            @PathVariable Long id) {


        clientService.deleteClient(id);


        return ResponseEntity.noContent().build();
    }





    // Recherche par CIN
    @GetMapping("/cin/{cin}")
    public ResponseEntity<Client> getByCin(
            @PathVariable String cin) {


        return ResponseEntity.ok(
                clientService.getByCin(cin)
        );
    }





    // Recherche par email
    @GetMapping("/email/{email}")
    public ResponseEntity<Client> getByEmail(
            @PathVariable String email) {


        return ResponseEntity.ok(
                clientService.getByEmail(email)
        );
    }





    // Recherche par ville
    @GetMapping("/ville/{ville}")
    public ResponseEntity<List<Client>> getByVille(
            @PathVariable String ville) {


        return ResponseEntity.ok(
                clientService.getByVille(ville)
        );
    }

}
