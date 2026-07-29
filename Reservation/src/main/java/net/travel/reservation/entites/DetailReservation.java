package net.travel.reservation.entites;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetailReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long detailReservationId;
    // ✅ Lien vers la Réservation
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    // ✅ Lien vers le Service souscrit
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;


}