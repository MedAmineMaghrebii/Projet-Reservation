package net.travel.reservation.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceDTO {
    private String nom;
    private String description;
    private Double prix;
    private Boolean disponible;
    private Long salleId; // L'ID de la salle à laquelle associer le service
}
