package com.digitalbanking.payment.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payments")
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentId;           // UUID
    private String accountNumber;       // Paying account
    private String merchant;            // Merchant / Recipient
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private Instant timestamp;

    @PrePersist
    public void onCreate() {
        timestamp = Instant.now();
    }
}
