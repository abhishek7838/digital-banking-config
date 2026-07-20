package com.digitalbanking.payment.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentRequest {

    @NotBlank
    private String accountNumber;

    @NotBlank
    private String merchant;

    @DecimalMin("1.00")
    private BigDecimal amount;
}
