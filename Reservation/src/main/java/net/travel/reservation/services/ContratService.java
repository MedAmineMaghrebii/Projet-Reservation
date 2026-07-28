package net.travel.reservation.services;



import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Contrat;
import net.travel.reservation.entites.StatutContrat;
import net.travel.reservation.repositories.ContratRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class ContratService {


    private final ContratRepository contratRepository;



    // Récupérer tous les contrats
    public List<Contrat> getAllContrats() {

        return contratRepository.findAll();
    }





    // Récupérer un contrat par ID
    public Contrat getContratById(UUID id) {


        return contratRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Contrat introuvable"
                        ));
    }





    // Créer un contrat
    public Contrat createContrat(
            Contrat contrat
    ) {


        if(contratRepository
                .existsByNumeroContrat(
                        contrat.getNumeroContrat()
                )) {


            throw new RuntimeException(
                    "Numéro de contrat déjà utilisé"
            );
        }



        if(contrat.getStatut() == null){

            contrat.setStatut(
                    StatutContrat.NON_SIGNE
            );
        }



        return contratRepository.save(contrat);
    }





    // Modifier un contrat
    public Contrat updateContrat(
            UUID id,
            Contrat contratRequest
    ) {


        Contrat contrat =
                getContratById(id);



        contrat.setTitre(
                contratRequest.getTitre()
        );


        contrat.setDescription(
                contratRequest.getDescription()
        );


        contrat.setConditions(
                contratRequest.getConditions()
        );


        contrat.setEngagements(
                contratRequest.getEngagements()
        );


        contrat.setDateDebut(
                contratRequest.getDateDebut()
        );


        contrat.setDateFin(
                contratRequest.getDateFin()
        );


        contrat.setMontant(
                contratRequest.getMontant()
        );


        contrat.setUrlDocument(
                contratRequest.getUrlDocument()
        );



        return contratRepository.save(contrat);
    }





    // Modifier le statut du contrat
    public Contrat updateStatut(
            UUID id,
            StatutContrat statut
    ) {


        Contrat contrat =
                getContratById(id);


        contrat.setStatut(statut);


        return contratRepository.save(contrat);
    }





    // Chercher par numéro contrat
    public Contrat getByNumeroContrat(
            String numero
    ) {


        return (Contrat) contratRepository
                .findByNumeroContrat(numero)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Contrat introuvable"
                        ));
    }





    // Supprimer un contrat
    public void deleteContrat(
            UUID id
    ) {


        Contrat contrat =
                getContratById(id);


        contratRepository.delete(contrat);
    }





    // Contrats actifs
    public List<Contrat> getContratsSignes() {


        return contratRepository.findByStatut(StatutContrat.SIGNE) ;
    }

}
