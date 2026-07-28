package net.travel.reservation.exceptions;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> handleValidation(
            MethodArgumentNotValidException ex){

        Map<String,String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach(error ->{

            String field =
                    ((FieldError) error).getField();

            String message =
                    error.getDefaultMessage();

            errors.put(field, message);

        });

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);

    }

        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<String> handleRuntimeException(
                RuntimeException ex
        ) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());
        }

}
