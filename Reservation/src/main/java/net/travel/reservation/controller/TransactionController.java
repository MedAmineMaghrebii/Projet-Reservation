package net.travel.reservation.controller;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.StatutTransaction;
import net.travel.reservation.entites.Transaction;
import net.travel.reservation.entites.TypeTransaction;
import net.travel.reservation.services.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

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
}
