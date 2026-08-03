package net.travel.reservation.services;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.StatutTransaction;
import net.travel.reservation.entites.Transaction;
import net.travel.reservation.entites.TypeTransaction;
import net.travel.reservation.repositories.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

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
