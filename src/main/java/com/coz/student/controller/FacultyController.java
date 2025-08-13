package com.coz.student.controller;

import com.coz.student.entity.Faculty;
import com.coz.student.repository.EnrollmentRepository;
import com.coz.student.repository.FacultyRepository;
import com.coz.student.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "*")
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    // ✅ POST: Add new faculty
    @PostMapping("/add")
    public Faculty addFaculty(@RequestBody Faculty faculty) {
        return facultyService.addFaculty(faculty);
    }

    // ✅ GET: Get all faculty
    @GetMapping("/all")
    public List<Faculty> getAllFaculty() {
        return facultyService.getAllFaculty();
    }

    // ✅ GET: Get a single faculty by name
    @GetMapping("/get/{name}")
    public Faculty getFacultyByName(@PathVariable String name) {
        return facultyService.getFacultyByName(name);
    }

    // ✅ PUT: Update faculty
    @PutMapping("/update/{name}")
    public Faculty updateFaculty(@PathVariable String name, @RequestBody Faculty updatedFaculty) {
        return facultyService.updateFaculty(name, updatedFaculty.getAge(), updatedFaculty.getSpecialization());
    }

    // ✅ DELETE: Delete faculty (safe with duplicates)
    @DeleteMapping("/delete/{name}")
    public ResponseEntity<String> deleteFaculty(@PathVariable String name) {
        try {
            List<Faculty> facultyList = facultyRepository.findByName(name);
            if (facultyList == null || facultyList.isEmpty()) {
                return ResponseEntity.status(404).body("Faculty not found with name: " + name);
            }

            // Optional: Check if any faculty is used in enrollment
            boolean inUse = enrollmentRepository.findByFaculty_Name(name).size() > 0;
            if (inUse) {
                return ResponseEntity.status(400).body("❌ Cannot delete: Faculty assigned to enrolled students.");
            }

            facultyRepository.deleteAll(facultyList); // ✅ Safely delete duplicates
            return ResponseEntity.ok("✅ Record(s) deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("❌ Failed to delete: " + e.getMessage());
        }
    }
}
