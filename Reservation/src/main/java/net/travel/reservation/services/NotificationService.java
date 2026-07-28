package net.travel.reservation.services;


import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Notification;
import net.travel.reservation.entites.User;
import net.travel.reservation.repositories.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class NotificationService {


    private final NotificationRepository notificationRepository;



    // Récupérer toutes les notifications
    public List<Notification> getAllNotifications() {

        return notificationRepository.findAll();
    }




    // Récupérer une notification par ID
    public Notification getNotificationById(UUID id) {


        return notificationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Notification introuvable"
                        ));
    }





    // Créer une notification
    public Notification createNotification(
            Notification notification
    ) {


        return notificationRepository.save(notification);
    }





    // Récupérer les notifications d'un utilisateur
    public List<Notification> getUserNotifications(
            Long userId
    ) {


        return notificationRepository
                .findByUserUserId(userId);
    }





    // Notifications non lues
    public List<Notification> getUnreadNotifications(
            Long userId
    ) {


        return notificationRepository
                .findByUserUserIdAndLueFalse(userId);
    }





    // Compter les notifications non lues
    public long countUnread(
            Long userId
    ) {


        return notificationRepository
                .countByUserUserIdAndLueFalse(userId);
    }





    // Marquer comme lue
    public Notification markAsRead(
            UUID id
    ) {


        Notification notification =
                getNotificationById(id);


        notification.setLue(true);


        return notificationRepository.save(notification);
    }





    // Supprimer une notification
    public void deleteNotification(
            UUID id
    ) {


        Notification notification =
                getNotificationById(id);


        notificationRepository.delete(notification);

    }





    // Supprimer toutes les notifications d'un utilisateur
    public void deleteAllUserNotifications(
            User user
    ) {


        List<Notification> notifications =
                notificationRepository.findByUser(user);


        notificationRepository.deleteAll(notifications);

    }

}
