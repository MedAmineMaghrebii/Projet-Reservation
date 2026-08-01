package net.travel.reservation.services;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Notification;
import net.travel.reservation.entites.TypeNotification;
import net.travel.reservation.entites.User;
import net.travel.reservation.repositories.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification getNotificationById(UUID id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification introuvable avec l'ID : " + id));
    }

    @Transactional
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    // Helper très pratique pour déclencher des notifications depuis n'importe quel service
    @Transactional
    public Notification sendNotification(User user, String titre, String message, TypeNotification type, String url) {
        Notification notification = Notification.builder()
                .user(user)
                .titre(titre)
                .message(message)
                .type(type)
                .url(url)
                .lue(false)
                .build();
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserUserId(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserUserIdAndLueFalse(userId);
    }

    public long countUnread(Long userId) {
        return notificationRepository.countByUserUserIdAndLueFalse(userId);
    }

    @Transactional
    public Notification markAsRead(UUID id) {
        Notification notification = getNotificationById(id);
        notification.setLue(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void deleteNotification(UUID id) {
        Notification notification = getNotificationById(id);
        notificationRepository.delete(notification);
    }

    @Transactional
    public void deleteAllUserNotifications(User user) {
        List<Notification> notifications = notificationRepository.findByUser(user);
        notificationRepository.deleteAll(notifications);
    }
}