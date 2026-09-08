package com.siddu.ats.Services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component
public class AIEventParser {

    private final ObjectMapper objectMapper=new ObjectMapper();

    public AIEventParser() {
    }

    public Flux<ServerSentEvent<String>> parseAIEvents(
            Flux<String> chunks
    ) {

        return Flux.create(sink -> {

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

                                String type =
                                        node.get("type").asText();

                                JsonNode data =
                                        node.get("data");

                                String dataJson =
                                        objectMapper.writeValueAsString(data);

                                ServerSentEvent<String> event =
                                        ServerSentEvent.<String>builder()
                                                .event(type)
                                                .data(dataJson)
                                                .build();

                                sink.next(event);

                            } catch (Exception e) {

                                sink.error(e);
                                return;
                            }
                        }
                    },

                    sink::error,

                    sink::complete
            );
        });
    }
}