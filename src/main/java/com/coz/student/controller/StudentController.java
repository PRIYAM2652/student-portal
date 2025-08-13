package com.coz.student.controller;

import com.coz.student.dto.PasswordResetRequest;
import com.coz.student.entity.Student;
import com.coz.student.repository.StudentRepository;
import com.coz.student.service.StudentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
@Slf4j
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Student student) {
        studentService.register(student);
        return ResponseEntity.ok("Registered Successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Student student) {
        Student existingStudent = studentService.login(student.getUsername(), student.getPassword());
        if (existingStudent != null && existingStudent.getPassword().equals(student.getPassword())) {
            return ResponseEntity.ok(existingStudent);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password.");
        }
    }

    // ✅ Correctly placed and fixed resetPassword method
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request) {
        Student student = studentRepository.findByUsername(request.getUsername());
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if (!student.getPassword().equals(request.getOldPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Old password is incorrect");
        }

        student.setPassword(request.getNewPassword());
        studentRepository.save(student);
        return ResponseEntity.ok("Password updated successfully");
    }
}
