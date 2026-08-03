package net.travel.reservation.entites;

import com.fasterxml.jackson.annotation.JsonIgnore;
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





    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutReservation statut;

    @Column(nullable = true, precision = 10, scale = 2)
    private BigDecimal montantAPayer;

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
    // ✅ TARIFICATION APPLIQUÉE (Option 2)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tarification_id")
    private TarificationSalle tarificationAppliquee;
    @PreUpdate
    public void preUpdate() {
        this.dateModification = LocalDateTime.now();
    }
    //RELATION--------------------------------------------
    // ✅ CLIENT (1-à-n)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    // ✅ SALLE (1-à-n) ← AJOUT IMPORTANT
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salle_id", nullable = false)
    private Salle salle;

    // ✅ PAIEMENTS (1-à-n) ← AJOUT IMPORTANT
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private List<Paiement> paiements = new ArrayList<>();
    @OneToOne(mappedBy = "reservation",
            cascade = CascadeType.ALL,
            orphanRemoval = false,
            fetch = FetchType.LAZY)
    private Contrat contrat;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "reservation_services",
            joinColumns = @JoinColumn(name = "reservation_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    @Builder.Default
    private List<Service> services = new ArrayList<>();
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