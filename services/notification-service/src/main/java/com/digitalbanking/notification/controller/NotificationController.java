package com.digitalbanking.notification.controller;

import com.digitalbanking.notification.dto.NotificationRequest;
import com.digitalbanking.notification.model.Notification;
import com.digitalbanking.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // Called by other microservices (transaction, payment, auth…)
    @PostMapping
    public ResponseEntity<Notification> send(@Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.ok(notificationService.sendNotification(request));
    }

    // Fetch notifications for customer/admin portal
    @GetMapping
    public ResponseEntity<List<Notification>> getByRecipient(
            @RequestParam("recipient") String recipient
    ) {
        return ResponseEntity.ok(notificationService.getNotificationsForRecipient(recipient));
    }
}
