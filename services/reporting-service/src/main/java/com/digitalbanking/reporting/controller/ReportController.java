package com.digitalbanking.reporting.controller;

import com.digitalbanking.reporting.dto.ReportGenerationRequest;
import com.digitalbanking.reporting.dto.ReportResponse;
import com.digitalbanking.reporting.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/generate")
    public ResponseEntity<ReportResponse> generate(
            @Valid @RequestBody ReportGenerationRequest request) {
        return ResponseEntity.ok(reportService.generateReport(request));
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<List<ReportResponse>> getByAccount(
            @PathVariable String accountNumber) {
        return ResponseEntity.ok(reportService.getReportsForAccount(accountNumber));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }
}
