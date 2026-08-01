package net.travel.reservation.services;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Reservation;
import net.travel.reservation.entites.StatutReservation;
import net.travel.reservation.entites.TypePeriode;
import net.travel.reservation.repositories.ReservationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;

    /**
     * Récupérer toutes les réservations
     */
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }


    //list of reservation by clientId
    public Page<Reservation> getReservationHistory(
            Long clientId,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "dateCreation")
        );

        return reservationRepository.findByClientClientId(clientId, pageable);
    }


    /**
     * Récupérer une réservation par ID
     */
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation introuvable avec l'ID : " + id));
    }

    /**
     * Créer une réservation avec vérification de la date et du type de période
     */
    @Transactional
    public Reservation createReservation(Reservation reservation) {

        if (reservation.getReservationId() != null && reservation.getReservationId() <= 0) {
            reservation.setReservationId(null);
        }

        // 1. Validation des données obligatoires
        if (reservation.getDate() == null) {
            throw new RuntimeException("La date de l'événement est obligatoire");
        }
        if (reservation.getSalle() == null || reservation.getSalle().getSalleId() == null) {
            throw new RuntimeException("La salle est obligatoire");
        }
        if (reservation.getTarificationAppliquee() == null || reservation.getTarificationAppliquee().getPeriode() == null) {
            throw new RuntimeException("Le type de période (tarification) est obligatoire");
        }

        // 2. Vérification des conflits de date et période
        verifierDisponibilite(
                reservation.getSalle().getSalleId(),
                reservation.getDate(),
                reservation.getTarificationAppliquee().getPeriode()
        );

        // 3. Génération automatique du numéro de réservation s'il n'est pas renseigné
        if (reservation.getNumeroReservation() == null || reservation.getNumeroReservation().isBlank()) {
            reservation.setNumeroReservation("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        // 4. Statut par défaut si non spécifié
        if (reservation.getStatut() == null) {
            reservation.setStatut(StatutReservation.EN_ATTENTE);
        }

        return reservationRepository.save(reservation);
    }

    /**
     * Méthode privée de contrôle des chevauchements de créneaux
     */
    private void verifierDisponibilite(Long salleId, LocalDate date, TypePeriode nouvellePeriode) {
        List<Reservation> reservationsExistantes = reservationRepository
                .findBySalleSalleIdAndDateAndStatutNot(salleId, date, StatutReservation.ANNULEE);

        for (Reservation res : reservationsExistantes) {
            if (res.getTarificationAppliquee() != null) {
                TypePeriode periodeExistante = res.getTarificationAppliquee().getPeriode();

                // Conflit 1 : Même période demandée (ex: NUIT vs NUIT)
                if (periodeExistante == nouvellePeriode) {
                    throw new RuntimeException("La salle est déjà réservée pour la période : " + nouvellePeriode);
                }

                // Conflit 2 : La journée complète est déjà réservée
                if (periodeExistante == TypePeriode.JOURNEE) {
                    throw new RuntimeException("La salle est déjà réservée pour toute la journée");
                }

                // Conflit 3 : Une demi-journée ou nuit existe et la nouvelle demande est JOURNEE
                if (nouvellePeriode == TypePeriode.JOURNEE) {
                    throw new RuntimeException("Impossible de réserver la journée entière : le créneau " + periodeExistante + " est déjà pris");
                }
            }
        }
    }

    /**
     * Modifier une réservation
     */
    @Transactional
    public Reservation updateReservation(Long id, Reservation reservationRequest) {

        Reservation reservation = getReservationById(id);

        if (reservationRequest.getDate() != null) {
            reservation.setDate(reservationRequest.getDate());
        }
        if (reservationRequest.getMontantTotal() != null) {
            reservation.setMontantTotal(reservationRequest.getMontantTotal());
        }
        if (reservationRequest.getStatut() != null) {
            reservation.setStatut(reservationRequest.getStatut());
        }
        if (reservationRequest.getNotes() != null) {
            reservation.setNotes(reservationRequest.getNotes());
        }
        if (reservationRequest.getSalle() != null) {
            reservation.setSalle(reservationRequest.getSalle());
        }
        if (reservationRequest.getClient() != null) {
            reservation.setClient(reservationRequest.getClient());
        }
        if (reservationRequest.getTarificationAppliquee() != null) {
            reservation.setTarificationAppliquee(reservationRequest.getTarificationAppliquee());
        }
        if (reservationRequest.getModifiePar() != null) {
            reservation.setModifiePar(reservationRequest.getModifiePar());
        }

        return reservationRepository.save(reservation);
    }

    /**
     * Supprimer une réservation
     */
    @Transactional
    public void deleteReservation(Long id) {
        Reservation reservation = getReservationById(id);
        reservationRepository.delete(reservation);
    }

    /**
     * Recherche de réservations par date d'événement
     */
    public List<Reservation> findByDate(LocalDate date) {
        return reservationRepository.findByDate(date);
    }

    /**
     * Vérifier si au moins une réservation existe à cette date
     */
    public boolean existsReservationByDate(LocalDate date) {
        return reservationRepository.existsByDate(date);
    }
}