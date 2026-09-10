package com.siddu.ats.Services;

import com.siddu.ats.Exception.InvalidAIResponseException;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component
public class AIEventValidator {

    public Flux<ServerSentEvent<String>> validateComplete(
            Flux<ServerSentEvent<String>> events) {
        return events.collectList().flatMapMany(eventList -> {
            if (eventList.isEmpty() || !"complete".equals(eventList.get(eventList.size() - 1).event())) {
                return Flux.error(new InvalidAIResponseException(
                        "Incomplete AI response: missing complete event"
                ));
            }

            return Flux.fromIterable(eventList);
        });
    }
}
