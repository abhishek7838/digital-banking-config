package com.digitalbanking.account.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
public class AccountSummaryResponse {

    private String accountNumber;
    private BigDecimal balance;
    private Double totalDeposits;
    private Double totalWithdrawals;
    private Instant lastTransactionDate;
}
