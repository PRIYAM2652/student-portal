package com.coz.student.repository;

import com.coz.student.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    List<Faculty> findByName(String name);  // Can return multiple, so returns List
}
