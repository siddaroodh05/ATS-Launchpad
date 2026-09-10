package com.siddu.ats.Controller;


import com.siddu.ats.DTO.Requests.Jobdescription;
import com.siddu.ats.DTO.Response.*;
import com.siddu.ats.Services.*;
import org.apache.tika.exception.TikaException;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;


import java.io.IOException;

@RestController
public class AtsController {
    private final ResumeExtractor resumeExtractor;
    private final ResumeAnalysisService resumeAnalysisService;
    private final JobMatchAnalysisService jobMatchAnalysisService;
    private final McqTestgenerateService mcqTestgenerateService;


    public AtsController(ResumeExtractor resumeExtractor,
                         ResumeAnalysisService resumeAnalysisService,
                         JobMatchAnalysisService jobMatchAnalysisService,
                         McqTestgenerateService mcqTestgenerateService
                         ) {
        this.resumeExtractor = resumeExtractor;
        this.resumeAnalysisService = resumeAnalysisService;
        this.jobMatchAnalysisService = jobMatchAnalysisService;
        this.mcqTestgenerateService = mcqTestgenerateService;

    }


    @PostMapping(
            value = "/Ats/resume/AtsAnalysis",
            produces = MediaType.TEXT_EVENT_STREAM_VALUE
    )
    public Flux<ServerSentEvent<String>> uploadResume(
            @RequestParam("file") MultipartFile file
    ) throws IOException, TikaException {

        String resumeText = resumeExtractor.extractText(file);

        return resumeAnalysisService.analyze(resumeText);
    }

    @PostMapping(
            value = "/Ats/resume/job-match-Analysis",
            produces = MediaType.TEXT_EVENT_STREAM_VALUE
    )
    public Flux<ServerSentEvent<String>> uploadJobMatchAnalysis(
            @RequestParam("file") MultipartFile file, @RequestPart("jobDescription") Jobdescription jobDescription
    ) throws IOException, TikaException {

        return jobMatchAnalysisService.analyze(resumeExtractor.extractText(file),jobDescription.getDescription());
    }


    @PostMapping(
            value = "/Ats/resume/mcq-test",
            produces = MediaType.TEXT_EVENT_STREAM_VALUE
    )
    public Flux<ServerSentEvent<String>> uploadMcqTest(
            @RequestParam("file") MultipartFile file ) throws IOException, TikaException {

        return mcqTestgenerateService.analyze(resumeExtractor.extractText(file));
    }





}
