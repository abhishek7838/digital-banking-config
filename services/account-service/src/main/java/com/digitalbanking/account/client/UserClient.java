package com.digitalbanking.account.client;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class UserClient {

    @Autowired
    private WebClient.Builder webClient;

    public boolean userExists(Long userId) {
        try {
            webClient.build()
                .get()
                .uri("http://user-service/users/id/" + userId)
                .retrieve()
                .bodyToMono(Object.class)
                .block();

            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

