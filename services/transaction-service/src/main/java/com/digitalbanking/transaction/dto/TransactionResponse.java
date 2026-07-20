package com.digitalbanking.transaction.dto;

import com.digitalbanking.transaction.model.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class TransactionResponse {

    private String transactionId;
    private String fromAccount;
    private String toAccount;
    private BigDecimal amount;
    private TransactionType type;
    private Instant timestamp;
    private String status;
}
