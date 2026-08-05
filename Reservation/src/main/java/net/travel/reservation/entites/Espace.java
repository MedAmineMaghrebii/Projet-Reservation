package net.travel.reservation.entites;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "espaces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Espace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long espaceId;

    @Column(nullable = false)
    private String nom; // Ex: "Complexe Les Palmiers"

    @Column(length = 500)
    private String description;

    private String adresse;

    private String ville;

    private String telephone;

    @OneToMany(mappedBy = "espace", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Salle> salles = new ArrayList<>();
    // ✅ Relation vers Reservation (1-à-N)
    @OneToMany(mappedBy = "espace", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Reservation> reservations = new ArrayList<>();
    @OneToMany(mappedBy = "espace", fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<User> users = new ArrayList<>();

    // ✅ Relation vers Transaction (1-à-N)
    @OneToMany(mappedBy = "espace", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Transaction> transactions = new ArrayList<>();





}
