package com.siddu.ats.Exception;

import com.siddu.ats.DTO.Response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(InvalidCredentialException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredential(InvalidCredentialException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            new ErrorResponse(HttpStatus.UNAUTHORIZED.name(), exception.getMessage()));

    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorResponse> handleConflict(ConflictException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new
                ErrorResponse(HttpStatus.CONFLICT.name(),
                exception.getMessage()));
    }

    @ExceptionHandler(InvalidAIResponseException.class)
    public ResponseEntity<ErrorResponse> handleInvalidAIResponse(InvalidAIResponseException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(HttpStatus.BAD_REQUEST.name(),
                exception.getMessage()) );
    }
}