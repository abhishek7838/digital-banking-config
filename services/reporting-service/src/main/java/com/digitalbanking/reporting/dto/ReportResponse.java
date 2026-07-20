package com.digitalbanking.reporting.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
public class ReportResponse {

    private Long id;
    private String accountNumber;
    private LocalDate startDate;
    private LocalDate endDate;
    private String fileUrl;
    private Instant generatedAt;
    private String status;
}
