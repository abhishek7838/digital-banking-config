package com.digitalbanking.user.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ---------------- BASIC PROFILE ----------------

    @Column(nullable = false, unique = true, length = 180)
    private String email;

    @Column(nullable = false, length = 80)
    private String firstName;

    @Column(nullable = false, length = 80)
    private String lastName;

    @Column(length = 15)
    private String mobile;

    // ---------------- KYC DETAILS ----------------

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private KycStatus kycStatus;

    @Column(length = 30)
    private String kycDocType;       // PAN / AADHAR / PASSPORT

    @Column(length = 50)
    private String kycDocNumber;

    @Column(length = 255)
    private String kycRejectionReason;

    private Instant kycSubmittedAt;
    private Instant kycReviewedAt;

    @Column(length = 180)
    private String kycReviewer;      // admin email

    // ---------------- AUDIT ----------------

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    // ---------------- LIFECYCLE ----------------

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();

        // default KYC state for every new user
        if (this.kycStatus == null) {
            this.kycStatus = KycStatus.PENDING;
        }
    }
}
