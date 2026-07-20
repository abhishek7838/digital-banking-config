package com.digitalbanking.account.dto;

import com.digitalbanking.account.model.AccountStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AccountStatusUpdateRequest {

    @NotNull
    private AccountStatus status;
}
