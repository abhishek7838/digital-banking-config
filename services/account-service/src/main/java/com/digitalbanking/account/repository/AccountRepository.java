package com.digitalbanking.account.repository;

import com.digitalbanking.account.model.Account;
import com.digitalbanking.account.model.AccountStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);

    List<Account> findByCustomerId(Long customerId);

    boolean existsByCustomerIdAndAccountTypeAndStatus(
            Long customerId,
            Enum accountType,
            AccountStatus status
    );
}
