package com.digitalbanking.payment.client;

import com.digitalbanking.payment.dto.DebitCreditRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "account-service", path = "/api/accounts")
public interface AccountClient {

    @PostMapping("/{accountNumber}/debit")
    void debit(@PathVariable String accountNumber, @RequestBody DebitCreditRequest request);
}
