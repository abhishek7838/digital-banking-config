package com.digitalbanking.account.controller;

import com.digitalbanking.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/accounts/admin")
@RequiredArgsConstructor
public class AdminAccountController {

    private final AccountRepository accountRepository;

    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getTotalAccounts() {
        return ResponseEntity.ok(accountRepository.count());
    }
}