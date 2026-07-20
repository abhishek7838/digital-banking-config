package com.digitalbanking.reporting.service;

import com.digitalbanking.reporting.dto.ReportGenerationRequest;
import com.digitalbanking.reporting.dto.ReportResponse;

import java.util.List;

public interface ReportService {

    ReportResponse generateReport(ReportGenerationRequest request);

    List<ReportResponse> getReportsForAccount(String accountNumber);

    ReportResponse getReportById(Long id);
}
