package com.digitalbanking.user.kyc.controller;

import com.digitalbanking.user.kyc.dto.KycDecisionRequest;
import com.digitalbanking.user.kyc.dto.KycPendingResponse;
import com.digitalbanking.user.kyc.service.KycService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/kyc")
@RequiredArgsConstructor
public class KycController {

    private final KycService kycService;

    // ✅ Admin portal calls this:
    // GET http://localhost:8080/api/users/kyc/pending
    @GetMapping("/pending")
    public ResponseEntity<List<KycPendingResponse>> pending() {
        return ResponseEntity.ok(kycService.getPendingKyc());
    }

    // ✅ Admin approves/rejects:
    // POST http://localhost:8080/api/users/kyc/{userId}/decision
    @PostMapping("/{userId}/decision")
    public ResponseEntity<Void> decision(
            @PathVariable Long userId,
            @Valid @RequestBody KycDecisionRequest request,
            Authentication authentication
    ) {
        // If reviewer not provided from frontend, take it from token principal
        if (request.getReviewer() == null || request.getReviewer().isBlank()) {
            request.setReviewer(authentication.getName());
        }

        kycService.decideKyc(userId, request);
        return ResponseEntity.ok().build();
    }
}
