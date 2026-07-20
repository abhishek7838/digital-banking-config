package com.digitalbanking.user.repository;


import com.digitalbanking.user.model.KycStatus;
import com.digitalbanking.user.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByEmail(String email);

    boolean existsByEmail(String email);
    List<UserProfile> findByKycStatus(KycStatus status);
   

}
