package com.digitalbanking.payment.service;

import com.digitalbanking.payment.dto.PaymentRequest;
import com.digitalbanking.payment.dto.PaymentResponse;

public interface PaymentService {

    PaymentResponse makePayment(PaymentRequest request);
}
