package com.siddu.ats.DTO.Response;

import java.util.List;

public record ATSAnalysis(
        int atsScore,
        String summary,
        List<String> strengths,
        List<String> weaknesses,
        List<String> recommendations
) {}