package com.siddu.ats.Services;

import com.siddu.ats.Exception.InvalidAIResponseException;
import com.siddu.ats.Prompts.JobMatchPrompt;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.util.retry.Retry;

@Service
public class JobMatchAnalysisService {

    private final ChatClient chatClient;
    private final JobMatchPrompt jobMatchPrompt;
    private final AIEventParser aiEventParser;
        private final AIEventValidator aiEventValidator;
        private final AIEventErrorHandler aiEventErrorHandler;

    public JobMatchAnalysisService(ChatClient.Builder builder,
                                   JobMatchPrompt jobMatchPrompt,
                                   AIEventParser aiEventParser,
                                   AIEventValidator aiEventValidator,
                                   AIEventErrorHandler aiEventErrorHandler) {
        this.chatClient = builder.build();
        this.jobMatchPrompt = jobMatchPrompt;
        this.aiEventParser = aiEventParser;
        this.aiEventValidator = aiEventValidator;
        this.aiEventErrorHandler = aiEventErrorHandler;
    }

    public Flux<ServerSentEvent<String>> analyze(String resumeText,String jobdescription) {

        String prompt = jobMatchPrompt.prompt(resumeText,jobdescription);

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
                                error, "Job-fit analysis failed.")));

        return Flux.concat(started, aiEvents);
    }

}