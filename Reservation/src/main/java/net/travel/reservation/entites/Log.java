package net.travel.reservation.entites;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Log {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;


    // Type d'action : CREATE, UPDATE, DELETE, LOGIN...
    @Column(nullable = false)
    private String action;


    // Table concernée
    private String entite;


    // Id de l'objet concerné
    private Long entiteId;


    // Description détaillée
    @Column(length = 1000)
    private String description;


    // Adresse IP de l'utilisateur
    private String ipAddress;


    // Date de l'action
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateAction;


    @PrePersist
    public void prePersist() {
        this.dateAction = LocalDateTime.now();
    }

}