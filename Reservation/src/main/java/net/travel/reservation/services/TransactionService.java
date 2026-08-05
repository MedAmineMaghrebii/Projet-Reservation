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

        if (transaction.getLibelle() != null) ancienne.setLibelle(transaction.getLibelle());
        if (transaction.getDescription() != null) ancienne.setDescription(transaction.getDescription());
        if (transaction.getMontant() != null) ancienne.setMontant(transaction.getMontant());
        if (transaction.getType() != null) ancienne.setType(transaction.getType());
        if (transaction.getStatut() != null) ancienne.setStatut(transaction.getStatut());
        if (transaction.getModePaiement() != null) ancienne.setModePaiement(transaction.getModePaiement());
        if (transaction.getReservation() != null) ancienne.setReservation(transaction.getReservation());

        // ✅ Ajout de la mise à jour de l'espace
        if (transaction.getEspace() != null) ancienne.setEspace(transaction.getEspace());

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

    // --- ✅ NOUVELLES MÉTHODES POUR L'ESPACE ---

    /**
     * Transactions d'un espace spécifique
     */
    public List<Transaction> getTransactionsByEspace(Long espaceId) {
        return transactionRepository.findByEspaceEspaceId(espaceId);
    }

    /**
     * Transactions d'un espace avec un statut précis
     */
    public List<Transaction> getTransactionsByEspaceAndStatut(Long espaceId, StatutTransaction statut) {
        return transactionRepository.findByEspaceEspaceIdAndStatut(espaceId, statut);
    }

    /**
     * Transactions d'un espace avec un type précis
     */
    public List<Transaction> getTransactionsByEspaceAndType(Long espaceId, TypeTransaction type) {
        return transactionRepository.findByEspaceEspaceIdAndType(espaceId, type);
    }
}