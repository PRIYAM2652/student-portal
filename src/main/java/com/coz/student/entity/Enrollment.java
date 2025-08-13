package com.coz.student.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String course;
    private String duration;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    @Transient
    public String getStudentName() {
        return student != null ? student.getName() : null;
    }

    @Transient
    public String getFacultyName() {
        return faculty != null ? faculty.getName() : null;
    }
}