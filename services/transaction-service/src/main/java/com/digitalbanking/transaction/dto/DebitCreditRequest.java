package com.digitalbanking.transaction.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class DebitCreditRequest {
    @NotNull
    @DecimalMin("0.01")
    private BigDecimal amount;
}
