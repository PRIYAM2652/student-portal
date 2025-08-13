package com.coz.student.service;

import com.coz.student.entity.Student;
import com.coz.student.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public void register(Student student) {
        studentRepository.save(student);
    }

    @Override
    public Student login(String username, String password) {
        return studentRepository.findByUsernameAndPassword(username, password)
                .orElseThrow(() -> new RuntimeException("❌ No user found with given credentials"));
    }
}
