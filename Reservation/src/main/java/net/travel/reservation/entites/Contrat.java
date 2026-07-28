package net.travel.reservation.entites;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "contrats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contrat {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID contratId;


    // Référence du contrat
    @Column(nullable = false, unique = true)
    private String numeroContrat;


    // Exemple : Contrat de location salle
    @Column(nullable = false)
    private String titre;


    // Description en français ou arabe
    // Exemple :
    // "هذا العقد يخص كراء القاعة..."
    @Column(columnDefinition = "TEXT")
    private String description;


    // Conditions du contrat
    @Column(columnDefinition = "TEXT")
    private String conditions;


    // Engagements des parties
    @Column(columnDefinition = "TEXT")
    private String engagements;


    // Date de début
    private LocalDate dateDebut;


    // Date de fin
    private LocalDate dateFin;


    // Montant du contrat si nécessaire
    private Double montant;


    // PDF signé
    private String urlDocument;


    // Statut du contrat
    @Enumerated(EnumType.STRING)
    private StatutContrat statut;
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reservation_id", nullable = false, unique = true)
    private Reservation reservation;


    // Dates système
    private LocalDateTime dateCreation;

    private LocalDateTime dateModification;



    @PrePersist
    public void prePersist() {
        dateCreation = LocalDateTime.now();
    }


    @PreUpdate
    public void preUpdate() {
        dateModification = LocalDateTime.now();
    }

}