package net.travel.reservation.entites;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID notificationId;


    // Utilisateur qui reçoit la notification
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    // Titre de la notification
    @Column(nullable = false)
    private String titre;


    // Message détaillé
    @Column(columnDefinition = "TEXT")
    private String message;


    // Type de notification
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeNotification type;


    // Indique si elle est lue ou non
    @Column(nullable = false)
    private boolean lue = false;


    // Lien vers l'objet concerné
    // Exemple : /reservations/15
    private String url;


    // Date de création
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;


    @PrePersist
    public void prePersist() {
        dateCreation = LocalDateTime.now();
    }

}
