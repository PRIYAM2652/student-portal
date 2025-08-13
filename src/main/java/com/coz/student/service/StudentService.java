package com.coz.student.service;

import com.coz.student.entity.Student;

public interface StudentService {
    void register(Student student);
    Student login(String username, String password);
}
