package net.travel.reservation.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryExpenseDTO {
    private String category; // Basé sur le libelle ou la description
    private Double total;
    private Double percentage;
}