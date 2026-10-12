package com.nexushr.employee.notification;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(
            NotificationRepository repository,
            SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    public Notification create(Notification notification) {
        Notification saved = repository.save(notification);

        messagingTemplate.convertAndSend(
                "/topic/notifications",
                saved
        );

        return saved;
    }
}
