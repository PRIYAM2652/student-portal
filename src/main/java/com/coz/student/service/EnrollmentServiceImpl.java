package com.coz.student.service;

import com.coz.student.dto.EnrollmentDTO;
import com.coz.student.entity.Enrollment;
import com.coz.student.entity.Student;
import com.coz.student.entity.Faculty;
import com.coz.student.repository.EnrollmentRepository;
import com.coz.student.repository.FacultyRepository;
import com.coz.student.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Override
    public String enroll(EnrollmentDTO dto) {
        // 🔍 Check if student exists
        Student student = studentRepository.findByName(dto.getStudentName())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // 🔍 Check if faculty exists
        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        // ✅ Proceed to enroll
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(dto.getCourse());
        enrollment.setDuration(dto.getDuration());
        enrollment.setFaculty(faculty);

        enrollmentRepository.save(enrollment);
        return "Enrolled Successfully";
    }

    @Override
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }
}
