package com.digitalbanking.notification.service.impl;

import com.digitalbanking.notification.dto.NotificationRequest;
import com.digitalbanking.notification.model.Notification;
import com.digitalbanking.notification.repository.NotificationRepository;
import com.digitalbanking.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public Notification sendNotification(NotificationRequest request) {

        Notification notification = Notification.builder()
                .recipient(request.getRecipient())
                .message(request.getMessage())
                .type(request.getType())
                .createdAt(Instant.now())
                .build();

        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getNotificationsForRecipient(String recipient) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(recipient);
    }
}
