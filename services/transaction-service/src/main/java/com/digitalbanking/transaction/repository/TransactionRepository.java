package com.digitalbanking.transaction.repository;

import com.digitalbanking.transaction.model.Transaction;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, String> {

    // History: All transactions where account is sender or receiver
    List<Transaction> findByFromAccountOrToAccount(String from, String to);

    List<Transaction> findByFromAccountOrToAccountOrderByTimestampDesc(
            String fromAccount, String toAccount
    );

    // ---- SUMMARY METHODS (You were missing these!) ----

    // Total Deposits = money received (toAccount = accountNumber)
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.toAccount = :acc")
    BigDecimal sumDeposits(@Param("acc") String accountNumber);

    // Total Withdrawals = money sent (fromAccount = accountNumber)
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.fromAccount = :acc")
    BigDecimal sumWithdrawals(@Param("acc") String accountNumber);

    // Last transaction time
    @Query("SELECT MAX(t.timestamp) FROM Transaction t WHERE t.fromAccount = :acc OR t.toAccount = :acc")
    Instant findLastTransactionDate(@Param("acc") String accountNumber);
    
    
    
    @Query("""
            select t from Transaction t
            where (t.amount >= :minAmount) or (t.status = 'FAILED')
            order by t.timestamp desc
        """)
        Page<Transaction> findSuspicious(@Param("minAmount") BigDecimal minAmount, Pageable pageable);

        @Query("""
            select count(t) from Transaction t
            where (t.amount >= :minAmount) or (t.status = 'FAILED')
        """)
        long countSuspicious(@Param("minAmount") BigDecimal minAmount);

        // OPTIONAL: get full history search by account (admin drilldown)
        @Query("""
            select t from Transaction t
            where (t.fromAccount = :account) or (t.toAccount = :account)
            order by t.timestamp desc
        """)
        Page<Transaction> findByAccount(@Param("account") String account, Pageable pageable);
    
}
