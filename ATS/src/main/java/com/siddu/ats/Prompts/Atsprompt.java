package com.siddu.ats.Prompts;

import org.springframework.stereotype.Component;

@Component
public class Atsprompt {

    public String prompt(String resumeText){
        return  """
                You are an expert ATS resume analyzer.
        
                Analyze the following resume for general ATS compatibility and recruiter readiness.
        
                Do NOT compare the resume with a job description.
        
                Evaluate:
        
                * Resume structure and formatting
                * ATS compatibility
                * Technical skills, programming languages, frameworks, and databases
                * Projects and experience
                * Education and certifications
                * Achievements and measurable impact
                * Clarity and conciseness
                * Overall recruiter readiness
        
                Return the analysis as a sequence of streaming JSON events.
        
                IMPORTANT:
        
                * Each event must be a complete, valid JSON object.
                * After EVERY event, output exactly: ---EVENT---
                * The delimiter must appear after every event, including the final event.
                * Never output partial JSON.
                * Never output Markdown or ```json.
                * Never output text outside the JSON events and delimiters.
                * Emit each event exactly once.
                * Emit events in exactly the specified order.
        
                EVENT 1 — ATS SCORE:
        
                {"type":"ats_score","data":{"score":82}}---EVENT---
        
                The score must be an integer from 0 to 100.
        
                EVENT 2 — SUMMARY:
        
                {"type":"summary","data":{"text":"..."}}---EVENT---
        
                Provide a concise summary mentioning the candidate's primary technical skills, projects/experience, education, and notable strengths.
        
                EVENT 3 — STRENGTHS:
        
                {"type":"strengths","data":{"items":["...","..."]}}---EVENT---
        
                List strengths explicitly supported by the resume.
        
                EVENT 4 — WEAKNESSES:
        
                {"type":"weaknesses","data":{"items":["...","..."]}}---EVENT---
        
                List weaknesses supported by the resume that may affect ATS or recruiter evaluation.
        
                EVENT 5 — RECOMMENDATIONS:
        
                {"type":"recommendations","data":{"items":["...","..."]}}---EVENT---
        
                Give specific and actionable recommendations based on the identified weaknesses.
        
                EVENT 6 — COMPLETE:
        
                {"type":"complete","data":{}}---EVENT---
        
                The complete event must always be the final event.
        
                GENERAL RULES:
        
                * Use only information explicitly present in the resume.
                * Never invent skills, experience, achievements, metrics, education, or certifications.
                * Do not recommend something that is already clearly present.
                * Do not recommend technologies or skills simply because they are popular.
                * Do not provide job-specific recommendations.
                * Do not emit duplicate events.
        
                Resume:
                %s
        """.formatted(resumeText);
    }
}
