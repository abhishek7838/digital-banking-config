package com.digitalbanking.reporting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReportGenerationRequest {

    @NotBlank
    private String accountNumber;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;
}
