package net.travel.reservation.services;


import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Reservation;

import net.travel.reservation.repositories.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ReservationService {


    private final ReservationRepository reservationRepository;



    // Récupérer toutes les réservations
    public List<Reservation> getAllReservations() {

        return reservationRepository.findAll();
    }




    // Récupérer une réservation par ID
    public Reservation getReservationById(Long id) {

        return reservationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Réservation introuvable"
                        ));
    }





    // Créer une réservation
    public Reservation createReservation(
            Reservation reservation
    ) {


        // Vérification logique
        if(reservation.getHeureFin()
                .isBefore(reservation.getHeureDebut())) {

            throw new RuntimeException(
                    "L'heure de fin doit être après l'heure de début"
            );
        }


        return reservationRepository.save(reservation);
    }





    // Modifier une réservation
    public Reservation updateReservation(
            Long id,
            Reservation reservationRequest
    ) {


        Reservation reservation =
                getReservationById(id);



        reservation.setDate(
                reservationRequest.getDate()
        );


        reservation.setHeureDebut(
                reservationRequest.getHeureDebut()
        );


        reservation.setHeureFin(
                reservationRequest.getHeureFin()
        );


        reservation.setMontantTotal(
                reservationRequest.getMontantTotal()
        );


        reservation.setModifiePar(
                reservationRequest.getModifiePar()
        );


        return reservationRepository.save(reservation);
    }





    // Supprimer une réservation
    public void deleteReservation(Long id) {


        Reservation reservation =
                getReservationById(id);


        reservationRepository.delete(reservation);
    }





    // Recherche par date
    public List<Reservation> findByDate(
            LocalDate date
    ) {

        return reservationRepository.findByDate(date);
    }





    // Vérifier disponibilité d'une date
    public boolean existsReservationByDate(
            LocalDate date
    ) {

        return reservationRepository.existsByDate(date);
    }


}