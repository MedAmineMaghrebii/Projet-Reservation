package net.travel.reservation.services;




import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Paiement;
import net.travel.reservation.repositories.PaiementRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
    public class PaiementService {


        private final PaiementRepository paiementRepository;



        // Récupérer tous les paiements
        public List<Paiement> getAllPaiements() {

            return paiementRepository.findAll();
        }





        // Récupérer un paiement par ID
        public Paiement getPaiementById(UUID id) {


            return paiementRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Paiement introuvable"
                            ));
        }





        // Créer un paiement
        public Paiement createPaiement(
                Paiement paiement
        ) {


            if(paiement.getMontant()
                    .compareTo(BigDecimal.ZERO) <= 0) {


                throw new RuntimeException(
                        "Le montant doit être supérieur à zéro"
                );
            }


            return paiementRepository.save(paiement);
        }





        // Modifier un paiement
        public Paiement updatePaiement(
                UUID id,
                Paiement paiementRequest
        ) {


            Paiement paiement =
                    getPaiementById(id);



            paiement.setMontant(
                    paiementRequest.getMontant()
            );


            paiement.setTypePaiement(
                    paiementRequest.getTypePaiement()
            );


            paiement.setMethodePaiement(
                    paiementRequest.getMethodePaiement()
            );


            paiement.setNotes(
                    paiementRequest.getNotes()
            );


            return paiementRepository.save(paiement);
        }





        // Supprimer un paiement
        public void deletePaiement(UUID id) {


            Paiement paiement =
                    getPaiementById(id);


            paiementRepository.delete(paiement);

        }





        // Trouver les paiements d'une réservation
        public List<Paiement> getPaiementsByReservation(
                Long reservationId
        ) {


            return paiementRepository
                    .findByReservationReservationId(
                            reservationId
                    );
        }





        // Calculer total payé pour une réservation
        public BigDecimal calculerTotalPaye(
                Long reservationId
        ) {


            List<Paiement> paiements =
                    getPaiementsByReservation(reservationId);


            return paiements.stream()
                    .map(Paiement::getMontant)
                    .reduce(
                            BigDecimal.ZERO,
                            BigDecimal::add
                    );
        }

    }