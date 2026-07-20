package com.digitalbanking.payment.dto;

import com.digitalbanking.payment.model.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class PaymentResponse {

    private String paymentId;
    private String accountNumber;
    private String merchant;
    private BigDecimal amount;
    private PaymentStatus status;
    private Instant timestamp;
}
