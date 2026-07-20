package com.digitalbanking.account.service.impl;

import com.digitalbanking.account.client.TransactionClient;
import com.digitalbanking.account.dto.*;
import com.digitalbanking.account.exception.AccountNotFoundException;
import com.digitalbanking.account.exception.InsufficientBalanceException;
import com.digitalbanking.account.model.Account;
import com.digitalbanking.account.model.AccountStatus;
import com.digitalbanking.account.repository.AccountRepository;
import com.digitalbanking.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final TransactionClient transactionClient; // ✅ FIXED — ADDED

    private final Random random = new Random();

    @Override
    @Transactional
    public AccountResponse createAccount(AccountCreateRequest request) {

        String accountNumber = generateAccountNumber();

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .customerId(request.getCustomerId())
                .accountType(request.getAccountType())
                .status(AccountStatus.ACTIVE)
                .balance(request.getInitialDeposit() == null
                        ? BigDecimal.ZERO
                        : request.getInitialDeposit())
                .build();

        Account saved = accountRepository.save(account);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponse getByAccountNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + accountNumber));
        return toResponse(account);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> getByCustomer(Long customerId) {
        return accountRepository.findByCustomerId(customerId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AccountResponse updateStatus(String accountNumber, AccountStatusUpdateRequest request) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + accountNumber));

        account.setStatus(request.getStatus());
        Account saved = accountRepository.save(account);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void debit(String accountNumber, DebitCreditRequest request) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + accountNumber));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new InsufficientBalanceException("Account is not active: " + account.getStatus());
        }

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance");
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);
    }

    @Override
    @Transactional
    public void credit(String accountNumber, DebitCreditRequest request) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + accountNumber));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new InsufficientBalanceException("Account is not active: " + account.getStatus());
        }

        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);
    }

    private String generateAccountNumber() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 12; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    private AccountResponse toResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .customerId(account.getCustomerId())
                .accountType(account.getAccountType())
                .status(account.getStatus())
                .balance(account.getBalance())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .build();
    }

    @Override
    public AccountSummaryResponse getAccountSummary(String accountNumber) {

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // ⭐ Now WORKING because transactionClient exists
        Double totalDeposits = transactionClient.getTotalDeposits(accountNumber);
        Double totalWithdrawals = transactionClient.getTotalWithdrawals(accountNumber);
        Instant lastTxn = transactionClient.getLastTxnDate(accountNumber);

        AccountSummaryResponse summary = new AccountSummaryResponse();

        summary.setAccountNumber(accountNumber);
        summary.setBalance(account.getBalance());   // ✔ FIXED
        summary.setTotalDeposits(totalDeposits);
        summary.setTotalWithdrawals(totalWithdrawals);
        summary.setLastTransactionDate(lastTxn);

        return summary;
    }
}
