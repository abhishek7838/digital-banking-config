package com.digitalbanking.user.kyc.service.impl;

import com.digitalbanking.user.exception.UserNotFoundException;
import com.digitalbanking.user.kyc.dto.KycDecisionRequest;
import com.digitalbanking.user.kyc.dto.KycPendingResponse;
import com.digitalbanking.user.kyc.service.KycService;
import com.digitalbanking.user.model.KycStatus;
import com.digitalbanking.user.model.UserProfile;
import com.digitalbanking.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class KycServiceImpl implements KycService {

    private final UserProfileRepository userProfileRepository;

    @Override
    public List<KycPendingResponse> getPendingKyc() {
        List<UserProfile> pending = userProfileRepository.findByKycStatus(KycStatus.PENDING);

        return pending.stream()
                .map(u -> KycPendingResponse.builder()
                        .id(u.getId())
                        .email(u.getEmail())
                        .firstName(u.getFirstName())
                        .lastName(u.getLastName())
                        .mobile(u.getMobile())
                        .kycStatus(u.getKycStatus())
                        .kycDocType(u.getKycDocType())
                        .kycDocNumber(u.getKycDocNumber())
                        .kycSubmittedAt(u.getKycSubmittedAt() == null ? null : u.getKycSubmittedAt().toString())
                        .build())
                .toList();
    }

    @Override
    public void decideKyc(Long userId, KycDecisionRequest request) {
        UserProfile user = userProfileRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        // Only allow APPROVED/REJECTED decisions here (keep logic strict)
        if (request.getStatus() == KycStatus.REJECTED) {
            user.setKycRejectionReason(request.getRejectionReason());
        } else {
            user.setKycRejectionReason(null);
        }

        user.setKycStatus(request.getStatus());
        user.setKycReviewer(request.getReviewer());
        user.setKycReviewedAt(Instant.now());

        userProfileRepository.save(user);
    }
}
