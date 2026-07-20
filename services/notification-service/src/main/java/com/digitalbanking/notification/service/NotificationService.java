package com.digitalbanking.notification.service;

import com.digitalbanking.notification.dto.NotificationRequest;
import com.digitalbanking.notification.model.Notification;

import java.util.List;

public interface NotificationService {

    Notification sendNotification(NotificationRequest request);

    List<Notification> getNotificationsForRecipient(String recipient);
}
