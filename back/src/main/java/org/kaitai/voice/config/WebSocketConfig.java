package org.kaitai.voice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/voice-ws") // first handshake - to connect
                .setAllowedOriginPatterns("*")
                .setAllowedOrigins(
                        "http://localhost:5173",
                        "http://155.212.236.186",
                        "http://localhost:80",
                        "http://localhost:9000",
                        "http://localhost:6379"
                )
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/voice"); // all urls whose begins with /voice - routed to controllers
        registry.setUserDestinationPrefix("/user");
    }


}