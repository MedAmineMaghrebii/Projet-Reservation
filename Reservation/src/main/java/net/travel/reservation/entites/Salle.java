package net.travel.reservation.entites;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "salles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Salle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long salleId;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private Integer capaciteMax;

    @Column(length = 500)
    private String description;

    private String adresse;

    private String ville;

    private String telephone;

    @Column(unique = true)
    private String email;

    // ✅ Relation vers TarificationSalle
    @OneToMany(mappedBy = "salle", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<TarificationSalle> tarifications = new ArrayList<>();
    // ✅ Relation vers Service
    @OneToMany(mappedBy = "salle", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Service> services = new ArrayList<>();

    // ✅ AJOUT : Relation bidirectionnelle vers User (Les employés/gestionnaires de la salle)
    @OneToMany(mappedBy = "salle", fetch = FetchType.LAZY)
    @JsonIgnore // Évite la boucle de référence JSON infinie lors de la sérialisation
    @Builder.Default
    private List<User> users = new ArrayList<>();
}