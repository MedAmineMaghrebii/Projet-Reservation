package net.travel.reservation.entites;

import jakarta.persistence.*;
import lombok.*;
import net.travel.reservation.entites.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.UUID;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationId;
    @Column(nullable = false, unique = true)
    private String numeroReservation;

    // ✅ Date de l'ÉVÉNEMENT (pas date de réservation)
    @Column(nullable = false)
    private LocalDate date;

    // ✅ Heures (début/fin)
    @Column(nullable = false)
    private LocalTime heureDebut;

    @Column(nullable = false)
    private LocalTime heureFin;



    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutReservation statut;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montantTotal;

    // ✅ Token portail client
    @Column(unique = true)
    private String tokenReservation;

    // Notes internes
    @Column(columnDefinition = "TEXT")
    private String notes;
    @PrePersist
    public void prePersist() {
        this.dateCreation = LocalDateTime.now();
        if (this.tokenReservation == null) {
            this.tokenReservation = UUID.randomUUID().toString();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.dateModification = LocalDateTime.now();
    }
    //RELATION--------------------------------------------
    // ✅ CLIENT (1-à-n)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    // ✅ SALLE (1-à-n) ← AJOUT IMPORTANT
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "salle_id", nullable = false)
    private Salle salle;

    // ✅ PAIEMENTS (1-à-n) ← AJOUT IMPORTANT
    @OneToOne(mappedBy = "reservation",
            cascade = CascadeType.PERSIST,
            orphanRemoval = false,
            fetch = FetchType.LAZY)
    private Paiement paiement;
    @OneToOne(mappedBy = "reservation",
            cascade = CascadeType.ALL,
            orphanRemoval = false,
            fetch = FetchType.LAZY)
    private Contrat contrat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cree_par", nullable = false)
    private User creePar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modifie_par")
    private User modifiePar;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    private LocalDateTime dateModification;


}