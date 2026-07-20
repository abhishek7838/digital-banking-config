package com.digitalbanking.reporting.client;

import com.digitalbanking.reporting.dto.TransactionSummaryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name="transaction-service", path="/api/transactions")
public interface TransactionClient {
  @GetMapping("/{accountNumber}")
  List<TransactionSummaryDto> getTransactions(@PathVariable String accountNumber);
}

