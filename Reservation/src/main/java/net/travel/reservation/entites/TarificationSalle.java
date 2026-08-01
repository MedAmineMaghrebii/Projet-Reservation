package net.travel.reservation.entites;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "tarifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TarificationSalle {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @JsonProperty("typePeriode")
    private TypePeriode periode;


    @Column(nullable = false)
    private BigDecimal prix;


    @ManyToOne(fetch = FetchType.EAGER) // Charge la salle pour pouvoir lire son id
    @JoinColumn(name = "salle_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    // 👈 Permet de RECEVOIR la salle au POST sans la RENVOYER en boucle
    private Salle salle;

    @Transient
    @JsonProperty("salleId") // 👈 Garantit que la propriété s'appelle salleId dans le JSON de sortie
    public Long getSalleId() {
        return salle != null ? salle.getSalleId() : null;


    }
}
