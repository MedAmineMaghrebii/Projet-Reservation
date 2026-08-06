package net.travel.reservation.controller;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.dto.CategoryExpenseDTO;
import net.travel.reservation.dto.MonthlyChartDTO;
import net.travel.reservation.dto.MonthlySummaryDTO;
import net.travel.reservation.entites.StatutTransaction;
import net.travel.reservation.entites.Transaction;
import net.travel.reservation.entites.TypeTransaction;
import net.travel.reservation.services.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("/yearly-chart")
    public ResponseEntity<List<MonthlyChartDTO>> getYearlyChart(
            @RequestParam Integer year
    ) {
        return ResponseEntity.ok(
                transactionService.getYearlyChart(year)
        );
    }

    // Exemple 1 (Année seule) : /api/finance/stats/summary?year=2026
    // Exemple 2 (Année + Mois) : /api/finance/stats/summary?year=2026&month=8
    @GetMapping("/summary")
    public ResponseEntity<MonthlySummaryDTO> getSummary(
            @RequestParam("year") int year,
            @RequestParam(value = "month", required = false) Integer month) {
        return ResponseEntity.ok(transactionService.getSummary(year, month));
    }

    @GetMapping("/expenses-by-category")
    public ResponseEntity<List<CategoryExpenseDTO>> getExpensesByCategory(
            @RequestParam("year") int year,
            @RequestParam(value = "month", required = false) Integer month) {
        return ResponseEntity.ok(transactionService.getExpensesByCategory(year, month));
    }

    /**
     * Ajouter une transaction
     */
    @PostMapping
    public Transaction ajouterTransaction(@RequestBody Transaction transaction) {
        return transactionService.ajouterTransaction(transaction);
    }

    /**
     * Modifier une transaction
     */
    @PutMapping("/{id}")
    public Transaction modifierTransaction(
            @PathVariable Long id,
            @RequestBody Transaction transaction) {

        return transactionService.modifierTransaction(id, transaction);
    }

    /**
     * Supprimer une transaction
     */
    @DeleteMapping("/{id}")
    public void supprimerTransaction(@PathVariable Long id) {
        transactionService.supprimerTransaction(id);
    }

    /**
     * Toutes les transactions
     */
    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    /**
     * Transaction par ID
     */
    @GetMapping("/{id}")
    public Transaction getTransactionById(@PathVariable Long id) {
        return transactionService.getTransactionById(id);
    }

    /**
     * Transactions d'une réservation
     */
    @GetMapping("/reservation/{reservationId}")
    public List<Transaction> getTransactionsByReservation(
            @PathVariable Long reservationId) {

        return transactionService.getTransactionsByReservation(reservationId);
    }

    /**
     * Transactions par statut
     */
    @GetMapping("/statut/{statut}")
    public List<Transaction> getTransactionsByStatut(
            @PathVariable StatutTransaction statut) {

        return transactionService.getTransactionsByStatut(statut);
    }

    /**
     * Transactions par type
     */
    @GetMapping("/type/{type}")
    public List<Transaction> getTransactionsByType(
            @PathVariable TypeTransaction type) {

        return transactionService.getTransactionsByType(type);
    }

    // --- ✅ NOUVEAUX ENDPOINTS POUR L'ESPACE ---

    /**
     * Transactions d'un espace spécifique
     */
    @GetMapping("/espace/{espaceId}")
    public List<Transaction> getTransactionsByEspace(
            @PathVariable Long espaceId) {

        return transactionService.getTransactionsByEspace(espaceId);
    }

    /**
     * Transactions d'un espace avec un statut précis
     */
    @GetMapping("/espace/{espaceId}/statut/{statut}")
    public List<Transaction> getTransactionsByEspaceAndStatut(
            @PathVariable Long espaceId,
            @PathVariable StatutTransaction statut) {

        return transactionService.getTransactionsByEspaceAndStatut(espaceId, statut);
    }

    /**
     * Transactions d'un espace avec un type précis
     */
    @GetMapping("/espace/{espaceId}/type/{type}")
    public List<Transaction> getTransactionsByEspaceAndType(
            @PathVariable Long espaceId,
            @PathVariable TypeTransaction type) {

        return transactionService.getTransactionsByEspaceAndType(espaceId, type);
    }
}