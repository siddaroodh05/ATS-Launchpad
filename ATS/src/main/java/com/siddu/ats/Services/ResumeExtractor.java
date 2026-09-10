package com.siddu.ats.Services;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import org.apache.tika.exception.TikaException;
import java.util.Set;

@Service
public class ResumeExtractor {

    private static final Set<String> SUPPORTED_TYPES = Set.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    private final Tika tika;

    public ResumeExtractor() {
        this.tika = new Tika();
    }

    public String extractText(MultipartFile file)
            throws IOException, TikaException {

        validateFile(file);

        return tika.parseToString(file.getInputStream());
    }

    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Resume file cannot be empty");
        }

        String contentType = file.getContentType();

        if (contentType == null || !SUPPORTED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException(
                    "Unsupported resume format. Only PDF, DOC and DOCX are allowed."
            );
        }
    }
}