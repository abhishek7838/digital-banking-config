package com.digitalbanking.account.dto;

import com.digitalbanking.account.model.AccountStatus;
import com.digitalbanking.account.model.AccountType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class AccountResponse {

    private Long id;
    private String accountNumber;
    private Long customerId;
    private AccountType accountType;
    private AccountStatus status;
    private BigDecimal balance;
    private Instant createdAt;
    private Instant updatedAt;
}
