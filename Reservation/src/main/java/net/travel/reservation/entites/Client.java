package net.travel.reservation.entites;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clientId;


    @Column(nullable = false, unique = true)
    private String cin;


    // Chemin ou URL de l'image CIN
    private String imageCin;


    @Column(nullable = false)
    private String nom;


    @Column(nullable = false)
    private String prenom;


    private String telephone;

    @OneToMany(mappedBy = "client",
            cascade = CascadeType.PERSIST,
            orphanRemoval = false,
            fetch = FetchType.LAZY)
    @Builder.Default
    private List<Reservation> reservations = new ArrayList<>();
    private String email;


    private String adresse;


    private String ville;

}