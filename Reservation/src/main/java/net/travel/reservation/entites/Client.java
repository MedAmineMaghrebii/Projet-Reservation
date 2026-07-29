package net.travel.reservation.entites;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    @NotBlank(message = "Le CIN est obligatoire")
    @Pattern(regexp = "^[0-9]{8}$", message = "Le CIN doit contenir exactement 8 chiffres")
    @Column(nullable = false, unique = true)
    private String cin;

    // Chemin ou URL de l'image CIN
    private String imageCin;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 3, message = "Le nom doit contenir au moins 3 caractères")
    @Column(nullable = false)
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 3, message = "Le prénom doit contenir au moins 3 caractères")
    @Column(nullable = false)
    private String prenom;

    @Pattern(regexp = "^[0-9]{8}$", message = "Le numéro de téléphone doit contenir exactement 8 chiffres")
    private String telephone;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Le format de l'email est invalide")
    private String email;

    private String adresse;

    private String ville;

    @OneToMany(mappedBy = "client",
            cascade = CascadeType.PERSIST,
            orphanRemoval = false,
            fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Reservation> reservations = new ArrayList<>();
}