package com.digitalbanking.user.kyc.dto;

import com.digitalbanking.user.model.KycStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycDecisionRequest {

    @NotNull
    private KycStatus status; // APPROVED or REJECTED

    private String reviewer; // admin email
    private String rejectionReason; // required if REJECTED (optional validation can be added)
}
