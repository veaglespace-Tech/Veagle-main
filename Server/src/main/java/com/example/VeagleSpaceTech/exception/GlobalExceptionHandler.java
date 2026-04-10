package com.example.VeagleSpaceTech.exception;

import com.example.VeagleSpaceTech.DTO.response.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserExists(UserAlreadyExistsException ex) {
        return ResponseEntity.status(400).body(
                new ErrorResponse(ex.getMessage(), 400, LocalDateTime.now())
        );
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex) {
        return ResponseEntity.status(401).body(
                new ErrorResponse(ex.getMessage(), 401, LocalDateTime.now())
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(
                new ErrorResponse(ex.getMessage(), 404, LocalDateTime.now())
        );
    }

    // fallback
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handle(Exception ex) {
        ex.printStackTrace();

        return ResponseEntity.status(500)
                .body(ex.getMessage()); // show real error
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {

        String error = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .get()
                .getDefaultMessage();

        return ResponseEntity.status(400)
                .body(new ErrorResponse(error, 400, LocalDateTime.now()));
    }

}