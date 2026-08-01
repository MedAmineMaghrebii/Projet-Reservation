package net.travel.reservation.services;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.dto.ClientSummary;
import net.travel.reservation.entites.Client;
import net.travel.reservation.repositories.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClientService {

    private final ClientRepository clientRepository;

    public List<ClientSummary> getClientsSummary() {
        List<ClientSummary> clients = clientRepository.getClientsSummary();
        clients.forEach(client -> {
            if (client.getTotalPaye() == null) {
                client.setTotalPaye(BigDecimal.ZERO);
            }
        });
        return clients;
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Client getClientById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable avec l'ID : " + id));
    }

    @Transactional
    public Client createClient(Client client) {
        if (clientRepository.existsByCin(client.getCin())) {
            throw new RuntimeException("Ce CIN existe déjà");
        }

        if (client.getEmail() != null && clientRepository.existsByEmail(client.getEmail())) {
            throw new RuntimeException("Cet email existe déjà");
        }

        return clientRepository.save(client);
    }

    @Transactional
    public Client updateClient(Long id, Client clientRequest) {
        Client client = getClientById(id);

        if (!client.getCin().equals(clientRequest.getCin()) &&
                clientRepository.existsByCin(clientRequest.getCin())) {
            throw new RuntimeException("Ce CIN est déjà utilisé");
        }

        if (clientRequest.getEmail() != null &&
                !clientRequest.getEmail().equalsIgnoreCase(client.getEmail()) &&
                clientRepository.existsByEmail(clientRequest.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        client.setCin(clientRequest.getCin());
        client.setImageCin(clientRequest.getImageCin());
        client.setNom(clientRequest.getNom());
        client.setPrenom(clientRequest.getPrenom());
        client.setTelephone(clientRequest.getTelephone());
        client.setEmail(clientRequest.getEmail());
        client.setAdresse(clientRequest.getAdresse());
        client.setVille(clientRequest.getVille());

        return clientRepository.save(client);
    }

    @Transactional
    public void deleteClient(Long id) {
        Client client = getClientById(id);
        clientRepository.delete(client);
    }

    public Client getByCin(String cin) {
        return clientRepository.findByCin(cin)
                .orElseThrow(() -> new RuntimeException("Client introuvable avec le CIN : " + cin));
    }

    public Client getByEmail(String email) {
        return clientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client introuvable avec l'email : " + email));
    }

    public List<Client> getByVille(String ville) {
        return clientRepository.findByVille(ville);
    }
}