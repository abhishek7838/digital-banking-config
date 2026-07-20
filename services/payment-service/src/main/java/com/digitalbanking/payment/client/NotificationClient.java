package com.digitalbanking.payment.client;

import com.digitalbanking.payment.dto.NotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service", path = "/api/notifications")
public interface NotificationClient {

    @PostMapping
    void sendInternal(@RequestBody NotificationRequest request);
}
