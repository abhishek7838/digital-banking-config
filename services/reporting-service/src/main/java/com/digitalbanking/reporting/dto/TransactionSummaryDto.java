package com.digitalbanking.reporting.dto;

import com.digitalbanking.reporting.model.ReportType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
public class TransactionSummaryDto {

    private String transactionId;
    private String fromAccount;
    private String toAccount;
    private BigDecimal amount;
    private String type;     // we'll use String to keep it decoupled
    private Instant timestamp;
    private String status;
}
