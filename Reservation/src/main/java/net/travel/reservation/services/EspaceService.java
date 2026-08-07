package net.travel.reservation.services;

import net.travel.reservation.entites.Espace;
import net.travel.reservation.entites.User;
import net.travel.reservation.repositories.EspaceRepository;
import net.travel.reservation.security.SecurityUtils; // Import de ton utilitaire de sécurité
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EspaceService {

    @Autowired
    private EspaceRepository espaceRepository;

    @Autowired
    private SecurityUtils securityUtils; // Injection de SecurityUtils

    public Espace creerEspace(Espace espace) {
        if (espaceRepository.existsByNom(espace.getNom())) {
            throw new RuntimeException("Un espace avec ce nom existe déjà.");
        }
        return espaceRepository.save(espace);
    }

    public Espace modifierEspace(Long id, Espace espaceDetails) {
        Espace espace = espaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Espace introuvable avec l'ID : " + id));

        espace.setNom(espaceDetails.getNom());
        espace.setDescription(espaceDetails.getDescription());
        espace.setAdresse(espaceDetails.getAdresse());
        espace.setVille(espaceDetails.getVille());
        espace.setTelephone(espaceDetails.getTelephone());

        return espaceRepository.save(espace);
    }

    public Optional<Espace> trouverEspaceParId(Long id) {
        return espaceRepository.findById(id);
    }

    public List<Espace> listerTousLesEspaces() {
        return espaceRepository.findAll();
    }

    public void supprimerEspace(Long id) {
        if (!espaceRepository.existsById(id)) {
            throw new RuntimeException("Impossible de supprimer : Espace introuvable.");
        }
        espaceRepository.deleteById(id);
    }

    // Recherche par ville (insensible à la casse)
    public List<Espace> trouverEspacesParVille(String ville) {
        return espaceRepository.findByVilleIgnoreCase(ville);
    }

    // Recherche par mot-clé (nom ou ville) pour les barres de recherche frontend
    public List<Espace> rechercherEspaces(String keyword) {
        return espaceRepository.searchByNomOrVille(keyword);
    }

    // ✅ MODIFICATION : Récupérer l'espace et ses salles de l'utilisateur connecté automatiquement
    public Optional<Espace> trouverEspaceParUtilisateurConnecte() {
        User currentUser = securityUtils.getCurrentUser();
        return espaceRepository.findByUserId(currentUser.getUserId());
    }
}