package com.siddu.ats.Services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Component;

@Component
public class AIEventErrorHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ServerSentEvent<String> createErrorEvent(Throwable error, String fallbackMessage) {
        try {
            String message = objectMapper.writeValueAsString(error.getMessage());
            return ServerSentEvent.<String>builder()
                    .event("error")
                    .data("{\"message\":" + message + "}")
                    .build();
        } catch (JsonProcessingException exception) {
            return ServerSentEvent.<String>builder()
                    .event("error")
                    .data("{\"message\":\"" + fallbackMessage + "\"}")
                    .build();
        }
    }
}
