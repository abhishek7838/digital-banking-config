package com.digitalbanking.transaction.controller;

import com.digitalbanking.transaction.dto.TransactionRequest;
import com.digitalbanking.transaction.dto.TransactionResponse;
import com.digitalbanking.transaction.repository.TransactionRepository;
import com.digitalbanking.transaction.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
   

    // CUSTOMER/API ENDPOINT
    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(
            @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.transfer(request));
    }

    // CUSTOMER/API ENDPOINT
    @GetMapping("/{accountNumber}")
    public ResponseEntity<List<TransactionResponse>> history(@PathVariable String accountNumber) {
        return ResponseEntity.ok(transactionService.getTransactions(accountNumber));
    }

    // INTERNAL ENDPOINT (no JWT)
    @PostMapping("/internal/save")
    public ResponseEntity<TransactionResponse> saveInternal(
            @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.transfer(request));
    }

    // INTERNAL ENDPOINT for reporting-service
    @GetMapping("/internal/all")
    public ResponseEntity<List<TransactionResponse>> all() {
        return ResponseEntity.ok(transactionService.getTransactionsForReporting());
    }

}
