package com.digitalbanking.account.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.Instant;

@FeignClient(name = "transaction-service")
public interface TransactionClient {

    @GetMapping("/api/transactions/summary/{accountNumber}/total-deposits")
    Double getTotalDeposits(@PathVariable("accountNumber") String accountNumber);

    @GetMapping("/api/transactions/summary/{accountNumber}/total-withdrawals")
    Double getTotalWithdrawals(@PathVariable("accountNumber") String accountNumber);

    @GetMapping("/api/transactions/summary/{accountNumber}/last-txn-date")
    Instant getLastTxnDate(@PathVariable("accountNumber") String accountNumber);
}
