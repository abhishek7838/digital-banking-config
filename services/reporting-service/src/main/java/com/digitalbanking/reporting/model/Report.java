package com.digitalbanking.reporting.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String accountNumber;

    private LocalDate startDate;
    private LocalDate endDate;

    private String fileUrl;   // could be AWS S3 / local path

    private Instant generatedAt;

    private String status; // SUCCESS / FAILED
}
