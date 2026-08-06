package net.travel.reservation.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor

@Builder
public class MonthlySummaryDTO {

    private Integer year;
    private Integer month;

    private Long totalRevenusEnAttenteCount;
    private Double totalRevenus;
    private Double totalDepenses;
    private Double totalRevenusEnAttente;
    private Double totalDepensesEnAttente;
    private Double beneficeNet;

    public MonthlySummaryDTO(
            Integer year,
            Integer month,
            Long totalRevenusEnAttenteCount,
            Double totalRevenus,
            Double totalDepenses,
            Double totalRevenusEnAttente,
            Double totalDepensesEnAttente,
            Double beneficeNet
    ) {
        this.year = year;
        this.month = month;
        this.totalRevenusEnAttenteCount =totalRevenusEnAttenteCount;
        this.totalRevenus = totalRevenus;
        this.totalDepenses = totalDepenses;
        this.totalRevenusEnAttente = totalRevenusEnAttente;
        this.totalDepensesEnAttente = totalDepensesEnAttente;
        this.beneficeNet = beneficeNet;
    }
}