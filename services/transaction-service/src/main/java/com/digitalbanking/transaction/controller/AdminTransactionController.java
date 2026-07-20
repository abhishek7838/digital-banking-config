package com.digitalbanking.transaction.controller;

import com.digitalbanking.transaction.model.Transaction;
import com.digitalbanking.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions/admin")
@RequiredArgsConstructor
public class AdminTransactionController {

    private final TransactionRepository repository;

    @GetMapping("/suspicious")
    @PreAuthorize("hasAuthority('ADMIN')") // if you use ROLE_ADMIN then switch to hasRole("ADMIN")
    public Page<Transaction> suspicious(
            @RequestParam(defaultValue = "50000") BigDecimal minAmount,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return repository.findSuspicious(minAmount, PageRequest.of(page, size));
    }

    @GetMapping("/suspicious/count")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Map<String, Long> suspiciousCount(
            @RequestParam(defaultValue = "50000") BigDecimal minAmount
    ) {
        return Map.of("suspiciousCount", repository.countSuspicious(minAmount));
    }

    // OPTIONAL drilldown: view transactions by account
    @GetMapping("/by-account/{accountNumber}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<Transaction> byAccount(
            @PathVariable String accountNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return repository.findByAccount(accountNumber, PageRequest.of(page, size));
    }
}
