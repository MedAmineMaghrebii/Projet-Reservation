package net.travel.reservation.services;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Salle;
import net.travel.reservation.repositories.SalleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SalleService {

    private final SalleRepository salleRepository;

    // Récupérer toutes les salles
    public List<Salle> getAllSalles() {
        return salleRepository.findAll();
    }

    // Récupérer une salle par ID
    public Salle getSalleById(Long id) {
        return salleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salle introuvable avec l'ID : " + id));
    }

    // Ajouter une salle
    @Transactional
    public Salle createSalle(Salle salle) {
        if (salle.getNom() != null && salleRepository.existsByNom(salle.getNom())) {
            throw new RuntimeException("Une salle avec le nom '" + salle.getNom() + "' existe déjà");
        }
        return salleRepository.save(salle);
    }

    // Modifier une salle
    @Transactional
    public Salle updateSalle(Long id, Salle salleRequest) {
        Salle salle = getSalleById(id);

        // Vérification si le nom a changé et s'il est déjà utilisé
        if (salleRequest.getNom() != null &&
                !salleRequest.getNom().equals(salle.getNom()) &&
                salleRepository.existsByNom(salleRequest.getNom())) {
            throw new RuntimeException("Une autre salle porte déjà le nom : " + salleRequest.getNom());
        }

        salle.setNom(salleRequest.getNom());
        salle.setCapaciteMax(salleRequest.getCapaciteMax());
        salle.setDescription(salleRequest.getDescription());
        salle.setAdresse(salleRequest.getAdresse());
        salle.setVille(salleRequest.getVille());
        salle.setTelephone(salleRequest.getTelephone());
        salle.setEmail(salleRequest.getEmail());

        return salleRepository.save(salle);
    }

    // Supprimer une salle
    @Transactional
    public void deleteSalle(Long id) {
        Salle salle = getSalleById(id);
        salleRepository.delete(salle);
    }

    // Recherche par ville
    public List<Salle> findByVille(String ville) {
        return salleRepository.findByVille(ville);
    }

    // Recherche par capacité minimale
    public List<Salle> findByCapacite(Integer capacite) {
        return salleRepository.findByCapaciteMaxGreaterThanEqual(capacite);
    }

    // Recherche de salles correspondant aux critères
    public List<Salle> rechercherSalleDisponible(String ville, Integer capacite) {
        return salleRepository.findByVilleAndCapaciteMaxGreaterThanEqual(ville, capacite);
    }
}