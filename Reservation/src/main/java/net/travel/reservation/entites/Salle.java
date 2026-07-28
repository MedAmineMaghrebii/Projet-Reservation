package net.travel.reservation.entites;

import jakarta.persistence.*;
import lombok.*;

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

}