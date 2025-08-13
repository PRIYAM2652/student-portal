package com.coz.student.repository;

import com.coz.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByName(String name);  // ✅ Use Optional here as well

    Optional<Student> findByUsernameAndPassword(String username, String password);

    Student findByUsername(String username);
}
