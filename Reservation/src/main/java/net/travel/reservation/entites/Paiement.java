package net.travel.reservation.entites;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "paiements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paiement {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID paiementId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;


    // Montant payé
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;


    // ACOMPTE, VERSEMENT_ECHELONNE, SOLDE_FINAL
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypePaiement typePaiement;


    // ESPECES, CHEQUE, VIREMENT_BANCAIRE, CARTE
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MethodePaiement methodePaiement;


    // Date du paiement
    @Column(nullable = false)
    private LocalDateTime datePaiement;


    // Exemple : s3://reçus/REC-2024-001.pdf
    private String urlRecuPdf;


    // Notes facultatives
    @Column(columnDefinition = "TEXT")
    private String notes;


    // Utilisateur qui a créé le paiement
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cree_par")
    private User creePar;


    // Date création automatique
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;



    @PrePersist
    public void prePersist() {

        if(dateCreation == null) {
            dateCreation = LocalDateTime.now();
        }

        if(datePaiement == null) {
            datePaiement = LocalDateTime.now();
        }
    }

}