package net.travel.reservation.services;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Paiement;
import net.travel.reservation.entites.Reservation;
import net.travel.reservation.repositories.PaiementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaiementService {

    private final PaiementRepository paiementRepository;

    public List<Paiement> getAllPaiements() {
        return paiementRepository.findAll();
    }

    public Paiement getPaiementById(UUID id) {
        return paiementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paiement introuvable avec l'ID : " + id));
    }

    @Transactional
    public Paiement createPaiement(Paiement paiement) {
        if (paiement.getMontant() == null || paiement.getMontant().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Le montant du paiement doit être supérieur à zéro");
        }

        if (paiement.getReservation() == null) {
            throw new RuntimeException("Le paiement doit être associé à une réservation valide");
        }

        // Vérification du montant total de la réservation
        Reservation reservation = paiement.getReservation();
        BigDecimal totalDejaPaye = calculerTotalPaye(reservation.getReservationId());
        BigDecimal nouveauTotal = totalDejaPaye.add(paiement.getMontant());

        if (reservation.getMontantTotal() != null && nouveauTotal.compareTo(reservation.getMontantTotal()) > 0) {
            throw new RuntimeException("Le montant total payé (" + nouveauTotal +
                    ") dépasse le montant total de la réservation (" + reservation.getMontantTotal() + ")");
        }

        return paiementRepository.save(paiement);
    }

    @Transactional
    public Paiement updatePaiement(UUID id, Paiement paiementRequest) {
        Paiement paiement = getPaiementById(id);

        if (paiementRequest.getMontant() != null && paiementRequest.getMontant().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Le montant du paiement doit être supérieur à zéro");
        }

        paiement.setMontant(paiementRequest.getMontant());
        paiement.setTypePaiement(paiementRequest.getTypePaiement());
        paiement.setMethodePaiement(paiementRequest.getMethodePaiement());
        paiement.setNotes(paiementRequest.getNotes());
        paiement.setUrlRecuPdf(paiementRequest.getUrlRecuPdf());

        return paiementRepository.save(paiement);
    }

    @Transactional
    public void deletePaiement(UUID id) {
        Paiement paiement = getPaiementById(id);
        paiementRepository.delete(paiement);
    }

    public List<Paiement> getPaiementsByReservation(Long reservationId) {
        return paiementRepository.findByReservationReservationId(reservationId);
    }

    public BigDecimal calculerTotalPaye(Long reservationId) {
        List<Paiement> paiements = getPaiementsByReservation(reservationId);

        return paiements.stream()
                .map(Paiement::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}