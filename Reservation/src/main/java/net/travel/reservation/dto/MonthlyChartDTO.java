package net.travel.reservation.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MonthlyChartDTO {

    private Integer month;
    private Double revenus;
    private Double depenses;
}