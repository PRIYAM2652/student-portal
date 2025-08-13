package com.coz.student.dto;

import lombok.Data;

@Data
public class EnrollmentDTO {
    private String course;
    private String duration;
    private Long facultyId;
    private String studentName;


}
