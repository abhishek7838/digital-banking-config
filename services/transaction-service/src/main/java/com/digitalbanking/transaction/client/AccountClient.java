package com.digitalbanking.transaction.client;

import com.digitalbanking.transaction.dto.DebitCreditRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "ACCOUNT-SERVICE", path = "/api/accounts")

public interface AccountClient {

    @PostMapping("/{accountNumber}/debit")
    void debit(@PathVariable String accountNumber, @RequestBody DebitCreditRequest request);

    @PostMapping("/{accountNumber}/credit")
    void credit(@PathVariable String accountNumber, @RequestBody DebitCreditRequest request);
}
