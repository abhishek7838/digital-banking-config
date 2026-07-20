package com.digitalbanking.user.kyc.service;

import com.digitalbanking.user.kyc.dto.KycDecisionRequest;
import com.digitalbanking.user.kyc.dto.KycPendingResponse;

import java.util.List;

public interface KycService {
    List<KycPendingResponse> getPendingKyc();
    void decideKyc(Long userId, KycDecisionRequest request);
}
