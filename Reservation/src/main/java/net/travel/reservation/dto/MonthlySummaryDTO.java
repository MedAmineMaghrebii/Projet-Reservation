package net.travel.reservation.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MonthlySummaryDTO {
    private int year;
    private int month;
    private Double totalRevenus;
    private Double totalDepenses;
    private Double totalRevenusEnAttente;
    private Double totalDepensesEnAttente;
    private Double beneficeNet;
}