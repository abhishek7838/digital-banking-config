package com.digitalbanking.transaction.controller;

import com.digitalbanking.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;

@RestController
@RequestMapping("/api/transactions/summary")
@RequiredArgsConstructor
public class TransactionSummaryController {

    private final TransactionRepository repository;

    // Total deposits
    @GetMapping("/{accountNumber}/total-deposits")
    public Double totalDeposits(@PathVariable String accountNumber) {
        BigDecimal total = repository.sumDeposits(accountNumber);
        return total != null ? total.doubleValue() : 0.0;
    }

    // Total withdrawals
    @GetMapping("/{accountNumber}/total-withdrawals")
    public Double totalWithdrawals(@PathVariable String accountNumber) {
        BigDecimal total = repository.sumWithdrawals(accountNumber);
        return total != null ? total.doubleValue() : 0.0;
    }

    // Last transaction date
    @GetMapping("/{accountNumber}/last-txn-date")
    public Instant lastTxn(@PathVariable String accountNumber) {
        return repository.findLastTransactionDate(accountNumber);
    }
}
