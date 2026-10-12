package com.nexushr.employee.notification;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class NotificationWebSocketController {

    @MessageMapping("/notification")
    @SendTo("/topic/notifications")
    public Map<String, String> sendNotification(Map<String, String> notification) {
        return notification;
    }
}
