package com.coz.student.repository;

import com.coz.student.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByFaculty_Name(String facultyName);
}
