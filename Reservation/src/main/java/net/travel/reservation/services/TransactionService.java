package net.travel.reservation.services;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.dto.CategoryExpenseDTO;
import net.travel.reservation.dto.MonthlySummaryDTO;
import net.travel.reservation.entites.StatutTransaction;
import net.travel.reservation.entites.Transaction;
import net.travel.reservation.entites.TypeTransaction;
import net.travel.reservation.repositories.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;






    public MonthlySummaryDTO getSummary(int year, Integer month) {
        int targetMonth = (month != null) ? month : 0; // 0 signifie "Toute l'année"

        Double totalRevenus = transactionRepository.sumByTypeAndStatusAndYearAndOptionalMonth(
                TypeTransaction.REVENU, null, year, targetMonth);

        Double totalDepenses = transactionRepository.sumByTypeAndStatusAndYearAndOptionalMonth(
                TypeTransaction.DEPENSE, null, year, targetMonth);

        Double revenusEnAttente = transactionRepository.sumByTypeAndStatusAndYearAndOptionalMonth(
                TypeTransaction.REVENU, StatutTransaction.EN_ATTENTE, year, targetMonth);

        Double depensesEnAttente = transactionRepository.sumByTypeAndStatusAndYearAndOptionalMonth(
                TypeTransaction.DEPENSE, StatutTransaction.EN_ATTENTE, year, targetMonth);

        return MonthlySummaryDTO.builder()
                .year(year)
                .month(targetMonth)
                .totalRevenus(totalRevenus)
                .totalDepenses(totalDepenses)
                .totalRevenusEnAttente(revenusEnAttente)
                .totalDepensesEnAttente(depensesEnAttente)
                .beneficeNet(totalRevenus - totalDepenses)
                .build();
    }


    public List<CategoryExpenseDTO> getExpensesByCategory(int year, Integer month) {
        int targetMonth = (month != null) ? month : 0;
        List<Object[]> rawData = transactionRepository.findExpensesByCategoryForYearAndOptionalMonth(year, targetMonth);
        List<CategoryExpenseDTO> result = new ArrayList<>();

        double totalExpenses = rawData.stream()
                .mapToDouble(row -> ((Number) row[1]).doubleValue())
                .sum();

        for (Object[] row : rawData) {
            String category = (String) row[0];
            Double total = ((Number) row[1]).doubleValue();

            double percentage = totalExpenses > 0
                    ? Math.round((total / totalExpenses) * 100.0 * 10.0) / 10.0
                    : 0.0;

            result.add(CategoryExpenseDTO.builder()
                    .category(category)
                    .total(total)
                    .percentage(percentage)
                    .build());
        }

        return result;
    }

    /**
     * Ajouter une transaction
     */
    public Transaction ajouterTransaction(Transaction transaction) {

        if (transaction.getDateTransaction() == null) {
            transaction.setDateTransaction(LocalDateTime.now());
        }

        return transactionRepository.save(transaction);
    }

    /**
     * Modifier une transaction
     */
    public Transaction modifierTransaction(Long id, Transaction transaction) {

        Transaction ancienne = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction introuvable"));

        ancienne.setLibelle(transaction.getLibelle());
        ancienne.setDescription(transaction.getDescription());
        ancienne.setMontant(transaction.getMontant());
        ancienne.setType(transaction.getType());
        ancienne.setStatut(transaction.getStatut());
        ancienne.setModePaiement(transaction.getModePaiement());
        ancienne.setReservation(transaction.getReservation());

        return transactionRepository.save(ancienne);
    }

    /**
     * Supprimer une transaction
     */
    public void supprimerTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    /**
     * Retourner toutes les transactions
     */
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    /**
     * Retourner une transaction par son id
     */
    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction introuvable"));
    }

    /**
     * Transactions d'une réservation
     */
    public List<Transaction> getTransactionsByReservation(Long reservationId) {
        return transactionRepository.findByReservationReservationId(reservationId);
    }

    /**
     * Transactions par statut
     */
    public List<Transaction> getTransactionsByStatut(StatutTransaction statut) {
        return transactionRepository.findByStatut(statut);
    }

    /**
     * Transactions par type
     */
    public List<Transaction> getTransactionsByType(TypeTransaction type) {
        return transactionRepository.findByType(type);
    }
}
