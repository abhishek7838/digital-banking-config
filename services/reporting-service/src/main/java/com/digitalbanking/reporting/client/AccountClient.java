package com.digitalbanking.reporting.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="account-service", path="/api/accounts")
public interface AccountClient {
  @GetMapping("/{accountNumber}")
  Object getAccount(@PathVariable String accountNumber);
}

