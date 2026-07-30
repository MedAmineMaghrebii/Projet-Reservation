package net.travel.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ClientSummary {

    private Long clientId;
    private String cin;

    private String nom;

    private String prenom;

    private String email;

    private String telephone;

    private LocalDate derniereReservation;

    private Long nombreEvenements;

    private BigDecimal totalPaye;
}
