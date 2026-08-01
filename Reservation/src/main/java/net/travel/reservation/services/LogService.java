package net.travel.reservation.services;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Log;
import net.travel.reservation.entites.User;
import net.travel.reservation.repositories.LogRepository;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LogService {

    private final LogRepository logRepository;

    public List<Log> getAllLogs() {
        return logRepository.findAll();
    }

    public Log getLogById(Long id) {
        return logRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Log introuvable avec l'ID : " + id));
    }

    @Transactional
    public Log createLog(Log log) {
        if (log.getDateAction() == null) {
            log.setDateAction(LocalDateTime.now());
        }
        return logRepository.save(log);
    }

    // Helper très pratique pour traquer facilement des événements depuis d'autres services
    @Transactional
    public void logAction(User user, String action, String entite, Long entiteId, String description, String ipAddress) {
        Log log = Log.builder()
                .user(user)
                .action(action)
                .entite(entite)
                .entiteId(entiteId)
                .description(description)
                .ipAddress(ipAddress)
                .dateAction(LocalDateTime.now())
                .build();
        logRepository.save(log);
    }

    public List<Log> getLogsByUtilisateur(User utilisateur) {
        return logRepository.findByUserId(utilisateur.getUserId());
    }

    public List<Log> getLogsByAction(String action) {
        return logRepository.findByAction(action);
    }

    public List<Log> getLogsByEntite(String entite) {
        return logRepository.findByEntite(entite);
    }

    public List<Log> getHistoriqueObjet(String entite, Long entiteId) {
        return logRepository.findByEntiteAndEntiteId(entite, entiteId);
    }

    @Transactional
    public void deleteLog(Long id) {
        Log log = getLogById(id);
        logRepository.delete(log);
    }

    public @Nullable List<Log> getLogsByUserId(Long userId) {
        return logRepository.findByUserId(userId);
    }
}