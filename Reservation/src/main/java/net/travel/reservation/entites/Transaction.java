package net.travel.reservation.entites;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;




    // Exemple : "Acompte - ABC Consulting"
    @Column(nullable = false)
    private String libelle;



    private String description;



    @Column(nullable = false)
    private Double montant;



    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeTransaction type;



    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutTransaction statut;



    @Enumerated(EnumType.STRING)
    private ModePaiement modePaiement;



    private LocalDateTime dateTransaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "reservation_id",
            nullable = true
    )
    private Reservation reservation;

}