package com.coz.student.controller;

import com.coz.student.dto.EnrollmentDTO;
import com.coz.student.dto.EnrollmentUpdateDTO;
import com.coz.student.entity.Enrollment;
import com.coz.student.entity.Faculty;
import com.coz.student.repository.EnrollmentRepository;
import com.coz.student.repository.FacultyRepository;
import com.coz.student.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollment")
@CrossOrigin
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    // ✅ Enroll student
    @PostMapping("/enroll")
    public String enrollStudent(@RequestBody EnrollmentDTO enrollmentDto) {
        return enrollmentService.enroll(enrollmentDto);
    }

    // ✅ Get all students
    @GetMapping("/all")
    public List<Enrollment> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }

    // ✅ Get one student by ID
    @GetMapping("/{id}")
    public Enrollment getEnrollmentById(@PathVariable Long id) {
        return enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with ID: " + id));
    }

    // ✅ Update student (course, duration, faculty only — name fixed)
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateEnrollment(@PathVariable Long id, @RequestBody EnrollmentUpdateDTO updated) {
        Enrollment existing = enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        // Do NOT change student name
        existing.setCourse(updated.getCourse());
        existing.setDuration(updated.getDuration());

        Faculty faculty = facultyRepository.findById(updated.getFacultyId())
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        existing.setFaculty(faculty);

        enrollmentRepository.save(existing);

        return ResponseEntity.ok("Update Successful");
    }

    // ✅ Delete enrollment by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEnrollment(@PathVariable Long id) {
        return enrollmentRepository.findById(id)
                .map(enrollment -> {
                    enrollmentRepository.delete(enrollment);
                    return ResponseEntity.ok("Deleted successfully");
                })
                .orElseGet(() -> ResponseEntity.status(404).body("Enrollment not found with ID: " + id));
    }
}

