package com.digitalbanking.auth.client;

import com.digitalbanking.auth.dto.RegisterRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-service", path = "/api/users")
public interface UserClient {
  @PostMapping("/register")
  void createUserProfile(@RequestBody RegisterRequest request);
}
