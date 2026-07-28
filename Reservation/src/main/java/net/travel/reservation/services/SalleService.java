package net.travel.reservation.services;



import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Salle;
import net.travel.reservation.repositories.SalleRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class SalleService {


    private final SalleRepository salleRepository;



    // Récupérer toutes les salles
    public List<Salle> getAllSalles() {

        return salleRepository.findAll();
    }



    // Récupérer une salle par ID
    public Salle getSalleById(Long id) {

        return salleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Salle non trouvée"));
    }



    // Ajouter une salle
    public Salle createSalle(Salle salle) {


        if (salleRepository.existsByNom(salle.getNom())) {

            throw new RuntimeException(
                    "Cette salle existe déjà"
            );
        }


        return salleRepository.save(salle);
    }




    // Modifier une salle
    public Salle updateSalle(Long id, Salle salleRequest) {


        Salle salle = getSalleById(id);


        salle.setNom(salleRequest.getNom());

        salle.setCapaciteMax(
                salleRequest.getCapaciteMax()
        );

        salle.setDescription(
                salleRequest.getDescription()
        );

        salle.setAdresse(
                salleRequest.getAdresse()
        );

        salle.setVille(
                salleRequest.getVille()
        );

        salle.setTelephone(
                salleRequest.getTelephone()
        );

        salle.setEmail(
                salleRequest.getEmail()
        );


        return salleRepository.save(salle);
    }





    // Supprimer une salle
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


        return salleRepository
                .findByCapaciteMaxGreaterThanEqual(capacite);
    }





    // Recherche pour une réservation
    public List<Salle> rechercherSalleDisponible(
            String ville,
            Integer capacite
    ) {


        return salleRepository
                .findByVilleAndCapaciteMaxGreaterThanEqual(
                        ville,
                        capacite
                );
    }

}