package com.digitalbanking.transaction.service;

import com.digitalbanking.transaction.dto.TransactionRequest;
import com.digitalbanking.transaction.dto.TransactionResponse;
import com.digitalbanking.transaction.model.Transaction;

import java.util.List;

public interface TransactionService {

    TransactionResponse transfer(TransactionRequest request);

    List<TransactionResponse> getTransactions(String accountNumber);
    List<TransactionResponse> getTransactionsForReporting();
    
    List<Transaction> getHistory(String accountNumber);


}
