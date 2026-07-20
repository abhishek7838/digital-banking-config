package com.digitalbanking.account.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DebitCreditRequest {

   

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal amount;
}
