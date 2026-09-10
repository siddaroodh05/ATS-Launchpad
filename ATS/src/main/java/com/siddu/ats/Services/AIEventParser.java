package com.siddu.ats.Services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.siddu.ats.Exception.InvalidAIResponseException;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

import java.time.Duration;

@Component
public class AIEventParser {

        private static final Duration AI_RESPONSE_TIMEOUT = Duration.ofSeconds(30);
    private final ObjectMapper objectMapper=new ObjectMapper();

    public AIEventParser() {
    }

    public Flux<ServerSentEvent<String>> parseAIEvents(
            Flux<String> chunks
    ) {

        return Flux.<ServerSentEvent<String>>create(sink -> {

            StringBuilder buffer = new StringBuilder();

            chunks.subscribe(
                    chunk -> {

                        buffer.append(chunk);

                        String delimiter = "---EVENT---";

                        int delimiterIndex;

                        while ((delimiterIndex =
                                buffer.indexOf(delimiter)) != -1) {

                            String json =
                                    buffer.substring(0, delimiterIndex).trim();

                            buffer.delete(
                                    0,
                                    delimiterIndex + delimiter.length()
                            );

                            if (json.isEmpty()) {
                                continue;
                            }

                            try {

                                JsonNode node =
                                        objectMapper.readTree(json);

                                JsonNode typeNode = node.get("type");
                                JsonNode data = node.get("data");

                                if (typeNode == null || data == null) {
                                    throw new InvalidAIResponseException(
                                            "Invalid AI event structure"
                                    );
                                }

                                String type = typeNode.asText();

                                String dataJson =
                                        objectMapper.writeValueAsString(data);

                                ServerSentEvent<String> event =
                                        ServerSentEvent.<String>builder()
                                                .event(type)
                                                .data(dataJson)
                                                .build();

                                sink.next(event);

                            } catch (InvalidAIResponseException e) {

                                sink.error(e);
                                return;

                            } catch (Exception e) {

                                sink.error(
                                        new InvalidAIResponseException(
                                                "Failed to parse AI response",e
                                        )
                                );
                                return;
                            }
                        }
                    },

                                        sink::error,

                                        () -> {
                                                if (buffer.toString().trim().isEmpty()) {
                                                        sink.complete();
                                                } else {
                                                        sink.error(new InvalidAIResponseException(
                                                                        "Incomplete AI event: missing event delimiter"
                                                        ));
                                                }
                                        }
            );
                }).timeout(AI_RESPONSE_TIMEOUT);
    }
}