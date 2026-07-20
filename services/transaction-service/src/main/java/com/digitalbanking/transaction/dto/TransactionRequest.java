package com.digitalbanking.transaction.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransactionRequest {

    @NotBlank
    private String fromAccount;

    @NotBlank
    private String toAccount;

    @DecimalMin("1.00")
    private BigDecimal amount;
}
