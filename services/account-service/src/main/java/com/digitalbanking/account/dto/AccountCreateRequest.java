package com.digitalbanking.account.dto;

import com.digitalbanking.account.model.AccountType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountCreateRequest {

    @NotNull
    private Long customerId;

    @NotNull
    private AccountType accountType;

    @NotNull
    @Min(0)
    private BigDecimal initialDeposit;
}
