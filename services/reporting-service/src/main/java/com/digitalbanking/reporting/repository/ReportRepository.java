package com.digitalbanking.reporting.repository;

import com.digitalbanking.reporting.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByAccountNumberOrderByGeneratedAtDesc(String accountNumber);
}
