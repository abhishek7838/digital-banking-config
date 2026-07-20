package com.digitalbanking.reporting.service.impl;

import com.digitalbanking.reporting.dto.ReportGenerationRequest;
import com.digitalbanking.reporting.dto.ReportResponse;
import com.digitalbanking.reporting.model.Report;
import com.digitalbanking.reporting.repository.ReportRepository;
import com.digitalbanking.reporting.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;

    @Override
    public ReportResponse generateReport(ReportGenerationRequest request) {

        // 🎯 For now, we mock fileUrl — real project would generate a PDF using Jasper / iText
        String generatedFileUrl = "/files/report-" + System.currentTimeMillis() + ".pdf";

        Report report = Report.builder()
                .accountNumber(request.getAccountNumber())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .generatedAt(Instant.now())
                .fileUrl(generatedFileUrl)
                .status("SUCCESS")
                .build();

        reportRepository.save(report);

        return toResponse(report);
    }

    @Override
    public List<ReportResponse> getReportsForAccount(String accountNumber) {
        return reportRepository.findByAccountNumberOrderByGeneratedAtDesc(accountNumber)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ReportResponse getReportById(Long id) {
        return reportRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Report not found: " + id));
    }

    private ReportResponse toResponse(Report report) {
        return ReportResponse.builder()
                .id(report.getId())
                .accountNumber(report.getAccountNumber())
                .startDate(report.getStartDate())
                .endDate(report.getEndDate())
                .generatedAt(report.getGeneratedAt())
                .status(report.getStatus())
                .fileUrl(report.getFileUrl())
                .build();
    }
}
