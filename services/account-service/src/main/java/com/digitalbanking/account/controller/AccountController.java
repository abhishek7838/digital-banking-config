package com.digitalbanking.account.controller;

import com.digitalbanking.account.dto.*;
import com.digitalbanking.account.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(
            @Valid @RequestBody AccountCreateRequest request) {
        return ResponseEntity.ok(accountService.createAccount(request));
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<AccountResponse> getByAccountNumber(
            @PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.getByAccountNumber(accountNumber));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<AccountResponse>> getByCustomer(
            @PathVariable Long customerId) {
        return ResponseEntity.ok(accountService.getByCustomer(customerId));
    }

    @PatchMapping("/{accountNumber}/status")
    public ResponseEntity<AccountResponse> updateStatus(
            @PathVariable String accountNumber,
            @Valid @RequestBody AccountStatusUpdateRequest request) {
        return ResponseEntity.ok(accountService.updateStatus(accountNumber, request));
    }

    @PostMapping("/{accountNumber}/debit")
    public ResponseEntity<Void> debit(
            @PathVariable String accountNumber,
            @Valid @RequestBody DebitCreditRequest request) {
        accountService.debit(accountNumber, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{accountNumber}/credit")
    public ResponseEntity<Void> credit(
            @PathVariable String accountNumber,
            @Valid @RequestBody DebitCreditRequest request) {
        accountService.credit(accountNumber, request);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{accountNumber}/summary")
    public ResponseEntity<AccountSummaryResponse> getSummary(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.getAccountSummary(accountNumber));
    }

    
}
