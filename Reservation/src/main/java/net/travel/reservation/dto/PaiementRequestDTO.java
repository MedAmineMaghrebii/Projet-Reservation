package net.travel.reservation.dto;

import lombok.Data;
import net.travel.reservation.entites.MethodePaiement;
import net.travel.reservation.entites.TypePaiement;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PaiementRequestDTO {
    private BigDecimal montant;
    private LocalDate datePaiement;
    private TypePaiement typePaiement;
    private MethodePaiement methodePaiement;
    private Long reservationId;
    private String notes;
}