package net.travel.reservation.services;



import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Log;

import net.travel.reservation.entites.User;
import net.travel.reservation.repositories.LogRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class LogService {


    private final LogRepository logRepository;



    // Récupérer tous les logs
    public List<Log> getAllLogs() {

        return logRepository.findAll();
    }




    // Récupérer un log par ID
    public Log getLogById(Long id) {


        return logRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Log introuvable"
                        ));
    }





    // Créer un log
    public Log createLog(Log log) {


        return logRepository.save(log);
    }





    // Chercher les logs d'un utilisateur
    public List<Log> getLogsByUtilisateur(
            User utilisateur
    ) {


        return logRepository
                .findByUser(utilisateur);
    }





    // Chercher par type d'action
    public List<Log> getLogsByAction(
            String action
    ) {


        return logRepository
                .findByAction(action);
    }





    // Historique d'une entité
    public List<Log> getLogsByEntite(
            String entite
    ) {


        return logRepository
                .findByEntite(entite);
    }





    // Historique d'un objet précis
    public List<Log> getHistoriqueObjet(
            String entite,
            Long entiteId
    ) {


        return logRepository
                .findByEntiteAndEntiteId(
                        entite,
                        entiteId
                );
    }





    // Supprimer un log
    public void deleteLog(Long id) {


        Log log = getLogById(id);


        logRepository.delete(log);
    }

}