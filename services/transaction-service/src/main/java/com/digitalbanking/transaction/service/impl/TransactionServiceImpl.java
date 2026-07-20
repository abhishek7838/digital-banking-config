package com.digitalbanking.transaction.service.impl;

import com.digitalbanking.transaction.client.AccountClient;
import com.digitalbanking.transaction.dto.DebitCreditRequest;
import com.digitalbanking.transaction.dto.TransactionRequest;
import com.digitalbanking.transaction.dto.TransactionResponse;
import com.digitalbanking.transaction.exception.InsufficientFundsException;
import com.digitalbanking.transaction.model.Transaction;
import com.digitalbanking.transaction.model.TransactionType;
import com.digitalbanking.transaction.repository.TransactionRepository;
import com.digitalbanking.transaction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final AccountClient accountClient;
    private final TransactionRepository transactionRepository;

    @Override
    @Transactional
    public TransactionResponse transfer(TransactionRequest request) {

        String transactionId = UUID.randomUUID().toString();

        try {
            // 1️⃣ DEBIT sender
            DebitCreditRequest debitRequest = new DebitCreditRequest(
                   
                    request.getAmount()                       // FIXED
            );

            accountClient.debit(
                    request.getFromAccount(),
                    debitRequest
            );

            // 2️⃣ CREDIT receiver
            DebitCreditRequest creditRequest = new DebitCreditRequest(
                   
                    request.getAmount()                       // FIXED
            );

            accountClient.credit(
                    request.getToAccount(),
                    creditRequest
            );

            // 3️⃣ Save SUCCESS transaction
            Transaction tx = Transaction.builder()
                    .transactionId(transactionId)
                    .fromAccount(request.getFromAccount())
                    .toAccount(request.getToAccount())
                    .amount(request.getAmount())
                    .type(TransactionType.TRANSFER)
                    .timestamp(Instant.now())
                    .status("SUCCESS")
                    .build();

            transactionRepository.save(tx);

            return toResponse(tx);

        } catch (Exception ex) {

            // Save FAILED transaction
            Transaction failed = Transaction.builder()
                    .transactionId(transactionId)
                    .fromAccount(request.getFromAccount())
                    .toAccount(request.getToAccount())
                    .amount(request.getAmount())
                    .type(TransactionType.TRANSFER)
                    .timestamp(Instant.now())
                    .status("FAILED")
                    .build();

            transactionRepository.save(failed);

            throw new InsufficientFundsException("Transfer failed: " + ex.getMessage());
        }
    }

    @Override
    public List<TransactionResponse> getTransactions(String accountNumber) {
        return transactionRepository
                .findByFromAccountOrToAccount(accountNumber, accountNumber)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private TransactionResponse toResponse(Transaction tx) {
        return TransactionResponse.builder()
                .transactionId(tx.getTransactionId())
                .fromAccount(tx.getFromAccount())
                .toAccount(tx.getToAccount())
                .amount(tx.getAmount())
                .type(tx.getType())
                .timestamp(tx.getTimestamp())
                .status(tx.getStatus())
                .build();
    }

    @Override
    public List<TransactionResponse> getTransactionsForReporting() {
        return transactionRepository
                .findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Transaction> getHistory(String accountNumber) {
        return transactionRepository
                .findByFromAccountOrToAccountOrderByTimestampDesc(accountNumber, accountNumber);
    }

}
