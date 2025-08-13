package com.coz.student.service;

import com.coz.student.dto.EnrollmentDTO;
import com.coz.student.entity.Enrollment;

import java.util.List;

public interface EnrollmentService {
    String enroll(EnrollmentDTO enrollmentDto);
    List<Enrollment> getAllEnrollments();
}
