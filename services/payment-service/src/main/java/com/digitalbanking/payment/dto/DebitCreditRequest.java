package com.digitalbanking.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DebitCreditRequest {

    private Long accountId;    // optional – some services ignore it
    private BigDecimal amount; // required
}
