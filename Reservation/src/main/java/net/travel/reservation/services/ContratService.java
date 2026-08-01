package net.travel.reservation.services;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Contrat;
import net.travel.reservation.entites.StatutContrat;
import net.travel.reservation.repositories.ContratRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContratService {

    private final ContratRepository contratRepository;

    public List<Contrat> getAllContrats() {
        return contratRepository.findAll();
    }

    public Contrat getContratById(UUID id) {
        return contratRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable avec l'ID : " + id));
    }

    @Transactional
    public Contrat createContrat(Contrat contrat) {
        if (contratRepository.existsByNumeroContrat(contrat.getNumeroContrat())) {
            throw new RuntimeException("Numéro de contrat déjà utilisé : " + contrat.getNumeroContrat());
        }

        // Validation métier des dates
        if (contrat.getDateDebut() != null && contrat.getDateFin() != null
                && contrat.getDateFin().isBefore(contrat.getDateDebut())) {
            throw new RuntimeException("La date de fin ne peut pas être antérieure à la date de début");
        }

        if (contrat.getStatut() == null) {
            contrat.setStatut(StatutContrat.NON_SIGNE);
        }

        return contratRepository.save(contrat);
    }

    @Transactional
    public Contrat updateContrat(UUID id, Contrat contratRequest) {
        Contrat contrat = getContratById(id);

        // Validation des dates
        if (contratRequest.getDateDebut() != null && contratRequest.getDateFin() != null
                && contratRequest.getDateFin().isBefore(contratRequest.getDateDebut())) {
            throw new RuntimeException("La date de fin ne peut pas être antérieure à la date de début");
        }

        contrat.setTitre(contratRequest.getTitre());
        contrat.setDescription(contratRequest.getDescription());
        contrat.setConditions(contratRequest.getConditions());
        contrat.setEngagements(contratRequest.getEngagements());
        contrat.setDateDebut(contratRequest.getDateDebut());
        contrat.setDateFin(contratRequest.getDateFin());
        contrat.setMontant(contratRequest.getMontant());
        contrat.setUrlDocument(contratRequest.getUrlDocument());

        return contratRepository.save(contrat);
    }

    @Transactional
    public Contrat updateStatut(UUID id, StatutContrat statut) {
        Contrat contrat = getContratById(id);
        contrat.setStatut(statut);
        return contratRepository.save(contrat);
    }

    public Contrat getByNumeroContrat(String numero) {
        return contratRepository.findByNumeroContrat(numero)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable avec le numéro : " + numero));
    }

    @Transactional
    public void deleteContrat(UUID id) {
        Contrat contrat = getContratById(id);
        contratRepository.delete(contrat);
    }

    public List<Contrat> getContratsSignes() {
        return contratRepository.findByStatut(StatutContrat.SIGNE);
    }
}