package com.nexushr.employee.notification;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository repository;
    private final NotificationService notificationService;

    public NotificationController(
            NotificationRepository repository,
            NotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }

    @GetMapping("/{username}")
    public List<Notification> getNotifications(
            @PathVariable String username) {

        return repository.findByUsernameOrderByCreatedAtDesc(username);
    }

    @PostMapping
    public Notification createNotification(
            @RequestBody Notification notification) {

        return notificationService.create(notification);
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {

        Notification notification = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        notification.setReadStatus(true);

        return repository.save(notification);
    }
}
