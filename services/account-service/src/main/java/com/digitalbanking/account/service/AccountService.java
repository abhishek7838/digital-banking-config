package com.digitalbanking.account.service;

import com.digitalbanking.account.dto.*;

import java.util.List;

public interface AccountService {

    AccountResponse createAccount(AccountCreateRequest request);

    AccountResponse getByAccountNumber(String accountNumber);

    List<AccountResponse> getByCustomer(Long customerId);

    AccountResponse updateStatus(String accountNumber, AccountStatusUpdateRequest request);

    void debit(String accountNumber, DebitCreditRequest request);

    void credit(String accountNumber, DebitCreditRequest request);
    
    AccountSummaryResponse getAccountSummary(String accountNumber);

}
