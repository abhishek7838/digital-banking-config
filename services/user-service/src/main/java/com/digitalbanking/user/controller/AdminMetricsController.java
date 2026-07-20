package com.digitalbanking.user.controller;

import com.digitalbanking.user.dto.AdminUserCountResponse;
import com.digitalbanking.user.service.AdminMetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/admin")
@RequiredArgsConstructor
public class AdminMetricsController {

    private final AdminMetricsService adminMetricsService;

    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserCountResponse> getUserCount() {
        long total = adminMetricsService.getTotalUsers();
        return ResponseEntity.ok(new AdminUserCountResponse(total));
    }
}
