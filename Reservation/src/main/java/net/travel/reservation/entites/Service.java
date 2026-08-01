package net.travel.reservation.entites;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceId;

    @Column(nullable = false)
    private String nom; // Ex: "DJ", "Décoration", "Traiteur", "Photographe"
    @Column(length = 500)
    private String description;
    private BigDecimal prix; // Prix du service en EUR/TND...
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salle_id", nullable = false)
    private Salle salle;
    @ManyToMany(mappedBy = "services")
    @JsonIgnore // Eviter la boucle de référence JSON
    @Builder.Default
    private List<Reservation> reservations = new ArrayList<>();
}