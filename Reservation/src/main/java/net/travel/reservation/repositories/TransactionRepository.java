package net.travel.reservation.repositories;

import net.travel.reservation.dto.MonthlyChartDTO;
import net.travel.reservation.dto.MonthlySummaryDTO;
import net.travel.reservation.entites.StatutTransaction;
import net.travel.reservation.entites.Transaction;
import net.travel.reservation.entites.TypeTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Toutes les transactions d'une réservation
    List<Transaction> findByReservationReservationId(Long reservationId);

    // Transactions par statut
    List<Transaction> findByStatut(StatutTransaction statut);

    // Transactions par type
    List<Transaction> findByType(TypeTransaction type);

    // Transactions d'une réservation avec un statut
    List<Transaction> findByReservationReservationIdAndStatut(
            Long reservationId,
            StatutTransaction statut
    );

    // Transactions d'une réservation avec un type
    List<Transaction> findByReservationReservationIdAndType(
            Long reservationId,
            TypeTransaction type
    );

    @Query("""
SELECT new net.travel.reservation.dto.MonthlyChartDTO(
    MONTH(t.dateTransaction),

    COALESCE(SUM(CASE
        WHEN t.type = net.travel.reservation.entites.TypeTransaction.REVENU
         AND t.statut IN (
            net.travel.reservation.entites.StatutTransaction.VALIDE,
            net.travel.reservation.entites.StatutTransaction.PAYE
         )
        THEN t.montant
        ELSE 0.0
    END), 0.0),

    COALESCE(SUM(CASE
        WHEN t.type = net.travel.reservation.entites.TypeTransaction.DEPENSE
         AND t.statut IN (
            net.travel.reservation.entites.StatutTransaction.VALIDE,
            net.travel.reservation.entites.StatutTransaction.PAYE
         )
        THEN t.montant
        ELSE 0.0
    END), 0.0)
)
FROM Transaction t
WHERE YEAR(t.dateTransaction) = :year
GROUP BY MONTH(t.dateTransaction)
ORDER BY MONTH(t.dateTransaction)
""")
    List<MonthlyChartDTO> getYearlyRevenueExpenseChart(
            @Param("year") Integer year
    );

    @Query("""
SELECT new net.travel.reservation.dto.MonthlySummaryDTO(
    :year,
    :month,
/* Total count en attent revenues */
    COALESCE(SUM(CASE
        WHEN t.type = net.travel.reservation.entites.TypeTransaction.REVENU
         AND (t.statut =
            net.travel.reservation.entites.StatutTransaction.EN_ATTENTE)
            
         
        THEN 1
        ELSE 0
    END), 0.0),
    /* Total validated/paid revenues */
    COALESCE(SUM(CASE
        WHEN t.type = net.travel.reservation.entites.TypeTransaction.REVENU
         AND t.statut IN (
            net.travel.reservation.entites.StatutTransaction.VALIDE,
            net.travel.reservation.entites.StatutTransaction.PAYE
         )
        THEN t.montant
        ELSE 0
    END), 0.0),

    /* Total validated/paid expenses */
    COALESCE(SUM(CASE
        WHEN t.type = net.travel.reservation.entites.TypeTransaction.DEPENSE
         AND t.statut IN (
            net.travel.reservation.entites.StatutTransaction.VALIDE,
            net.travel.reservation.entites.StatutTransaction.PAYE
         )
        THEN t.montant
        ELSE 0
    END), 0.0),

    /* Total pending revenues */
    COALESCE(SUM(CASE
        WHEN t.type = net.travel.reservation.entites.TypeTransaction.REVENU
         AND t.statut = net.travel.reservation.entites.StatutTransaction.EN_ATTENTE
        THEN t.montant
        ELSE 0
    END), 0.0),

    /* Total pending expenses */
    COALESCE(SUM(CASE
        WHEN t.type = net.travel.reservation.entites.TypeTransaction.DEPENSE
         AND t.statut = net.travel.reservation.entites.StatutTransaction.EN_ATTENTE
        THEN t.montant
        ELSE 0
    END), 0.0),

    /* Net profit */
    COALESCE(SUM(CASE
        WHEN t.type = net.travel.reservation.entites.TypeTransaction.REVENU
         AND t.statut IN (
            net.travel.reservation.entites.StatutTransaction.VALIDE,
            net.travel.reservation.entites.StatutTransaction.PAYE
         )
        THEN t.montant
        WHEN t.type = net.travel.reservation.entites.TypeTransaction.DEPENSE
         AND t.statut IN (
            net.travel.reservation.entites.StatutTransaction.VALIDE,
            net.travel.reservation.entites.StatutTransaction.PAYE
         )
        THEN -t.montant
        ELSE 0
    END), 0.0)
)
FROM Transaction t
WHERE YEAR(t.dateTransaction) = :year
  AND (:month = 0 OR MONTH(t.dateTransaction) = :month)
""")
    MonthlySummaryDTO getMonthlySummary(
            @Param("year") int year,
            @Param("month") int month);

    // 2. Dépenses par catégorie par Année et Mois (optionnel si month = 0)
    @Query("SELECT COALESCE(t.description, 'Autres'), SUM(t.montant) FROM Transaction t " +
            "WHERE t.type = net.travel.reservation.entites.TypeTransaction.DEPENSE " +
            "AND t.statut in (net.travel.reservation.entites.StatutTransaction.VALIDE," +
            "net.travel.reservation.entites.StatutTransaction.PAYE)"+
            "AND YEAR(t.dateTransaction) = :year " +
            "AND (:month = 0 OR MONTH(t.dateTransaction) = :month) " +
            "GROUP BY COALESCE(t.description, 'Autres')")
    List<Object[]> findExpensesByCategoryForYearAndOptionalMonth(
            @Param("year") int year,
            @Param("month") int month);


    // ✅ AJOUT : Toutes les transactions d'un espace spécifique
    List<Transaction> findByEspaceEspaceId(Long espaceId);

    // ✅ AJOUT : Transactions d'un espace avec un statut précis
    List<Transaction> findByEspaceEspaceIdAndStatut(
            Long espaceId,
            StatutTransaction statut
    );
    List<Transaction> findByEspaceEspaceIdAndType(Long espaceId, TypeTransaction type);
}
