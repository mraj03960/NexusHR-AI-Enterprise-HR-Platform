package com.nexushr.employee.controller;

import com.nexushr.employee.attendance.Attendance;
import com.nexushr.employee.repository.AttendanceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;

    public AttendanceController(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    @PostMapping
    public ResponseEntity<Attendance> createAttendance(
            @RequestBody Attendance attendance) {

        return ResponseEntity.ok(attendanceRepository.save(attendance));
    }

    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {

        return ResponseEntity.ok(attendanceRepository.findAll());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Attendance>> getEmployeeAttendance(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                attendanceRepository.findByEmployeeId(employeeId)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {

        if (!attendanceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        attendanceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
