package com.siddu.ats.Prompts;

import org.springframework.stereotype.Component;

@Component
public class McqTestPrompt {

    public String prompt(String resumeText) {

        return """
You are an expert technical interviewer and assessment generator. Generate 10 technical MCQs strictly from the candidate's resume, streamed as JSON events.

RESUME:
%s

FORMAT RULES:
- Every event = complete valid JSON, followed by ---EVENT---.
- No partial JSON, no markdown/code fences, no text outside events.
- Emit events in exact order below.

QUESTIONS:
Emit one event per question, questions 1 through 10 in order:
{"type":"question","data":{"questionNumber":1,"question":"...","options":["A","B","C","D"]}}---EVENT---
... repeat for questionNumber 2 through 10.

ANSWERS:
After all 10 question events, emit ONE single event containing all 10 answers:
{"type":"answers","data":{"items":[
  {"questionNumber":1,"correctAnswer":"...","explanation":"..."},
  {"questionNumber":2,"correctAnswer":"...","explanation":"..."},
  ... through questionNumber 10
]}}---EVENT---

Then: {"type":"complete","data":{}}---EVENT---

QUESTION RULES:
- Exactly 10, numbered 1-10, 4 options each, 1 correct each.
- Only tech/tools/concepts explicitly in resume — nothing absent from it.
- Test practical understanding; mix conceptual, code/output, scenario, debugging.
- Difficulty: 3 easy, 4 medium, 3 hard.
- Plausible distractors. No duplicate/near-duplicate questions.

ANSWER RULES:
- Exactly 10 items, numbered 1-10, matching their question.
- correctAnswer must exactly match one option text.
- Explanation ≤20 words each.

GENERAL:
- Use only resume content — no invented skills/experience/projects.
- No duplicates, no partial JSON.
- complete is always the final event.
                """.formatted(resumeText);
    }
}