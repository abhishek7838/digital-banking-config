package com.digitalbanking.notification.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NotificationRequest {

    @NotBlank
    private String recipient;

    @NotBlank
    private String message;

    private String type; // INFO / WARNING / PAYMENT / TRANSFER etc.
}
