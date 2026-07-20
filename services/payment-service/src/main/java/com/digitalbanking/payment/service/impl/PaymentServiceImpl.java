package com.digitalbanking.payment.service.impl;

import com.digitalbanking.payment.client.AccountClient;
import com.digitalbanking.payment.client.NotificationClient;
import com.digitalbanking.payment.dto.*;
import com.digitalbanking.payment.exception.PaymentFailedException;
import com.digitalbanking.payment.model.Payment;
import com.digitalbanking.payment.model.PaymentStatus;
import com.digitalbanking.payment.repository.PaymentRepository;
import com.digitalbanking.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final AccountClient accountClient;
    private final NotificationClient notificationClient;
    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public PaymentResponse makePayment(PaymentRequest request) {

        String paymentId = UUID.randomUUID().toString();

        try {
            // 1. Debit customer account
            accountClient.debit(
                    request.getAccountNumber(),
                    new DebitCreditRequest(
                            Long.valueOf(request.getAccountNumber()),
                            request.getAmount())
                    );

            // 2. Save payment success
            Payment payment = paymentRepository.save(
                    Payment.builder()
                            .paymentId(paymentId)
                            .accountNumber(request.getAccountNumber())
                            .merchant(request.getMerchant())
                            .amount(request.getAmount())
                            .status(PaymentStatus.SUCCESS)
                            .build()
            );

            // 3. Send notification
            notificationClient.sendInternal(
                    new NotificationRequest(
                            request.getAccountNumber(),
                            "Your payment of ₹" + request.getAmount() + " to " +
                                    request.getMerchant() + " is successful."
                    )
            );

            return toResponse(payment);

        } catch (Exception ex) {

            // Save failed payment
            Payment failed = paymentRepository.save(
                    Payment.builder()
                            .paymentId(paymentId)
                            .accountNumber(request.getAccountNumber())
                            .merchant(request.getMerchant())
                            .amount(request.getAmount())
                            .status(PaymentStatus.FAILED)
                            .build()
            );

            throw new PaymentFailedException("Payment failed: " + ex.getMessage());
        }
    }

    private PaymentResponse toResponse(Payment p) {
        return PaymentResponse.builder()
                .paymentId(p.getPaymentId())
                .accountNumber(p.getAccountNumber())
                .merchant(p.getMerchant())
                .amount(p.getAmount())
                .status(p.getStatus())
                .timestamp(p.getTimestamp())
                .build();
    }
}
