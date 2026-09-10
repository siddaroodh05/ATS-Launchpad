package com.siddu.ats.Services;

import com.siddu.ats.Exception.InvalidAIResponseException;
import com.siddu.ats.Prompts.McqTestPrompt;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.util.retry.Retry;

@Service
public class McqTestgenerateService {

    private final ChatClient chatClient;
    private final McqTestPrompt mcqTestPrompt;
    private final AIEventParser aiEventParser;
        private final AIEventValidator aiEventValidator;
        private final AIEventErrorHandler aiEventErrorHandler;


    public McqTestgenerateService(ChatClient.Builder builder,
                                 McqTestPrompt mcqTestPrompt,
                                  AIEventParser aiEventParser,
                                  AIEventValidator aiEventValidator,
                                  AIEventErrorHandler aiEventErrorHandler) {
        this.chatClient = builder.build();
        this.mcqTestPrompt = mcqTestPrompt;
        this.aiEventParser = aiEventParser;
        this.aiEventValidator = aiEventValidator;
        this.aiEventErrorHandler = aiEventErrorHandler;

    }

    public Flux<ServerSentEvent<String>> analyze(String resumeText) {

        String prompt = mcqTestPrompt.prompt(resumeText);

        Flux<ServerSentEvent<String>> started =
                Flux.just(
                        ServerSentEvent.<String>builder()
                                .event("started_analyzing")
                                .data("{}")
                                .build()
                );

        Flux<ServerSentEvent<String>> aiEvents =
                Flux.defer(() ->
                                chatClient
                                        .prompt()
                                        .user(prompt)
                                        .stream()
                                        .content()
                                        .transform(aiEventParser::parseAIEvents)
                                        .transform(aiEventValidator::validateComplete)
                        )
                        .retryWhen(
                                Retry.max(2)
                                        .filter(InvalidAIResponseException.class::isInstance)
                                        .onRetryExhaustedThrow((spec, signal) -> signal.failure())
                        )
                        .onErrorResume(error -> Flux.just(aiEventErrorHandler.createErrorEvent(
                                error, "Skill test generation failed.")));

        return Flux.concat(started, aiEvents);
    }

}
