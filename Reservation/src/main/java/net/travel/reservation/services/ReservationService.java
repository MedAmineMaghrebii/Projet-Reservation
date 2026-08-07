package net.travel.reservation.services;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Reservation;
import net.travel.reservation.entites.StatutReservation;
import net.travel.reservation.entites.TarificationSalle;
import net.travel.reservation.entites.TypePeriode;
import net.travel.reservation.entites.User;
import net.travel.reservation.repositories.ReservationRepository;
import net.travel.reservation.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final SecurityUtils securityUtils;

    /**
     * Récupérer toutes les réservations
     */
    public List<Reservation> getAllReservations() {
        User u = securityUtils.getCurrentUser();
        System.out.println(u);
        return reservationRepository.findAll();
    }

    /**
     * Liste des réservations par clientId avec pagination
     */
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

        User currentUser = securityUtils.getCurrentUser();

        if (reservation.getReservationId() != null && reservation.getReservationId() <= 0) {
            reservation.setReservationId(null);
        }

        // ... tes validations

        if (reservation.getNumeroReservation() == null || reservation.getNumeroReservation().isBlank()) {
            reservation.setNumeroReservation(
                    "RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()
            );
        }

        if (reservation.getStatut() == null) {
            reservation.setStatut(StatutReservation.EN_ATTENTE);
        }

        // Utilisateur qui crée la réservation
        reservation.setCreePar(currentUser);


        return reservationRepository.save(reservation);
    }

    /**
     * Méthode privée de contrôle des chevauchements de créneaux
     */
    private void verifierDisponibilite(Long salleId, LocalDate date, TypePeriode nouvellePeriode) {
        List<Reservation> reservationsExistantes = reservationRepository
                .findBySalleSalleIdAndDateAndStatutNot(salleId, date, StatutReservation.ANNULEE);

        for (Reservation res : reservationsExistantes) {
            if (res.getTarificationsAppliquees() != null) {
                for (TarificationSalle tarif : res.getTarificationsAppliquees()) {
                    TypePeriode periodeExistante = tarif.getPeriode();

                    if (periodeExistante != null) {
                        // Conflit 1 : Même période demandée
                        if (periodeExistante == nouvellePeriode) {
                            throw new RuntimeException("La salle est déjà réservée pour la période : " + nouvellePeriode);
                        }

                        // Conflit 2 : La journée complète est déjà réservée
                        if (periodeExistante == TypePeriode.JOURNEE) {
                            throw new RuntimeException("La salle est déjà réservée pour toute la journée");
                        }

                        // Conflit 3 : Une demi-journée ou autre existe et la nouvelle demande est JOURNEE
                        if (nouvellePeriode == TypePeriode.JOURNEE) {
                            throw new RuntimeException("Impossible de réserver la journée entière : le créneau " + periodeExistante + " est déjà pris");
                        }
                    }
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
        if (reservationRequest.getMontantAPayer() != null
                && reservationRequest.getMontantAPayer().compareTo(BigDecimal.ZERO) != 0) {
            reservation.setMontantAPayer(reservationRequest.getMontantAPayer());
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
        if (reservationRequest.getTarificationsAppliquees() != null && !reservationRequest.getTarificationsAppliquees().isEmpty()) {
            reservation.setTarificationsAppliquees(reservationRequest.getTarificationsAppliquees());
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