package com.coz.student.service;

import com.coz.student.entity.Faculty;
import com.coz.student.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyServiceImpl implements FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    @Override
    public Faculty addFaculty(Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    @Override
    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    @Override
    public Faculty getFacultyByName(String name) {
        List<Faculty> facultyList = facultyRepository.findByName(name);
        return facultyList.isEmpty() ? null : facultyList.get(0);  // ✅ Avoid Optional and errors
    }

    @Override
    public Faculty updateFaculty(String name, int age, String specialization) {
        List<Faculty> facultyList = facultyRepository.findByName(name);
        if (!facultyList.isEmpty()) {
            Faculty faculty = facultyList.get(0); // ✅ Pick first if duplicates exist
            faculty.setAge(age);
            faculty.setSpecialization(specialization);
            return facultyRepository.save(faculty);
        }
        return null;
    }

    @Override
    public void deleteFacultyByName(String name) {
        List<Faculty> facultyList = facultyRepository.findByName(name);
        if (facultyList.isEmpty()) {
            throw new RuntimeException("Faculty not found with name: " + name);
        }
        facultyRepository.deleteAll(facultyList); // ✅ Delete all with same name
    }
}
