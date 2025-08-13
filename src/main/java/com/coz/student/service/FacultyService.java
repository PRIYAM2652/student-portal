package com.coz.student.service;

import com.coz.student.entity.Faculty;

import java.util.List;

public interface FacultyService {
    Faculty addFaculty(Faculty faculty);
    List<Faculty> getAllFaculty();
    Faculty getFacultyByName(String name);
    Faculty updateFaculty(String name, int age, String specialization);
    void deleteFacultyByName(String name);
}
