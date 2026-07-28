package net.travel.reservation.services;



import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Client;
import net.travel.reservation.repositories.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ClientService {


    private final ClientRepository clientRepository;



    // Récupérer tous les clients
    public List<Client> getAllClients() {

        return clientRepository.findAll();
    }





    // Récupérer un client par ID
    public Client getClientById(Long id) {


        return clientRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Client introuvable"
                        ));
    }





    // Ajouter un client
    public Client createClient(
            Client client
    ) {


        if(clientRepository.existsByCin(
                client.getCin()
        )) {

            throw new RuntimeException(
                    "Ce CIN existe déjà"
            );
        }



        if(client.getEmail() != null &&
                clientRepository.existsByEmail(
                        client.getEmail()
                )) {


            throw new RuntimeException(
                    "Cet email existe déjà"
            );
        }



        return clientRepository.save(client);
    }





    // Modifier un client
    public Client updateClient(
            Long id,
            Client clientRequest
    ) {


        Client client =
                getClientById(id);



        client.setCin(
                clientRequest.getCin()
        );


        client.setImageCin(
                clientRequest.getImageCin()
        );


        client.setNom(
                clientRequest.getNom()
        );


        client.setPrenom(
                clientRequest.getPrenom()
        );


        client.setTelephone(
                clientRequest.getTelephone()
        );


        client.setEmail(
                clientRequest.getEmail()
        );


        client.setAdresse(
                clientRequest.getAdresse()
        );


        client.setVille(
                clientRequest.getVille()
        );



        return clientRepository.save(client);
    }





    // Supprimer un client
    public void deleteClient(
            Long id
    ) {


        Client client =
                getClientById(id);


        clientRepository.delete(client);
    }





    // Chercher par CIN
    public Client getByCin(
            String cin
    ) {


        return clientRepository
                .findByCin(cin)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Client introuvable"
                        ));
    }





    // Chercher par email
    public Client getByEmail(
            String email
    ) {


        return clientRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Client introuvable"
                        ));
    }





    // Chercher par ville
    public List<Client> getByVille(
            String ville
    ) {


        return clientRepository
                .findByVille(ville);
    }

}
