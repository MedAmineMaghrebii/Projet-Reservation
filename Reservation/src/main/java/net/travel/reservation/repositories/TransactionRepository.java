package net.travel.reservation.repositories;

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
    // 1. Somme par Type, Statut (optionnel), Année et Mois (optionnel si month = 0)
    @Query("SELECT COALESCE(SUM(t.montant), 0.0) FROM Transaction t " +
            "WHERE t.type = :type " +
            "AND (:statut IS NULL OR t.statut = :statut) " +
            "AND YEAR(t.dateTransaction) = :year " +
            "AND (:month = 0 OR MONTH(t.dateTransaction) = :month)")
    Double sumByTypeAndStatusAndYearAndOptionalMonth(
            @Param("type") TypeTransaction type,
            @Param("statut") StatutTransaction statut,
            @Param("year") int year,
            @Param("month") int month);

    // 2. Dépenses par catégorie par Année et Mois (optionnel si month = 0)
    @Query("SELECT COALESCE(t.description, 'Autres'), SUM(t.montant) FROM Transaction t " +
            "WHERE t.type = net.travel.reservation.entites.TypeTransaction.DEPENSE " +
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
    }
