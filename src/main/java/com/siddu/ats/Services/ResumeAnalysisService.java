package com.siddu.ats.Services;

import com.siddu.ats.Prompts.Atsprompt;
import com.siddu.ats.Prompts.ResumeAnalysisPrompt;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class ResumeAnalysisService {

    private final ChatClient chatClient;
    private final ResumeAnalysisPrompt resumeAnalysisPrompt;
    private final Atsprompt atsprompt;
    private final AIEventParser aiEventParser;

    public ResumeAnalysisService(ChatClient.Builder builder,
                                 ResumeAnalysisPrompt resumeAnalysisPrompt,
                                 Atsprompt atsprompt,
                                 AIEventParser aiEventParser) {
        this.chatClient = builder.build();
        this.resumeAnalysisPrompt = resumeAnalysisPrompt;
        this.atsprompt = atsprompt;
        this.aiEventParser = aiEventParser;

    }

    public Flux<ServerSentEvent<String>> analyze(String resumeText) {

        String prompt = atsprompt.prompt(resumeText);

        Flux<ServerSentEvent<String>> started =
                Flux.just(
                        ServerSentEvent.<String>builder()
                                .event(" started analyzing")
                                .data("{}")
                                .build()
                );

        Flux<ServerSentEvent<String>> aiEvents =
                chatClient
                        .prompt()
                        .user(prompt)
                        .stream()
                        .content()
                        .transform(aiEventParser::parseAIEvents);

        return Flux.concat(started, aiEvents);
    }


}
