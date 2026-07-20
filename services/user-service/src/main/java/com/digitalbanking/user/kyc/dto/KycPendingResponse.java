package com.digitalbanking.user.kyc.dto;

import com.digitalbanking.user.model.KycStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycPendingResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String mobile;
    private KycStatus kycStatus;
    private String kycDocType;
    private String kycDocNumber;
    private String kycSubmittedAt;
}
