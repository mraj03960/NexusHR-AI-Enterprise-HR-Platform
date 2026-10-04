package com.nexushr.employee.controller;

import com.nexushr.employee.leave.LeaveRequest;
import com.nexushr.employee.repository.LeaveRequestRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveRequestController {

    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveRequestController(LeaveRequestRepository leaveRequestRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
    }

    @PostMapping
    public ResponseEntity<LeaveRequest> createLeave(
            @RequestBody LeaveRequest leaveRequest) {

        return ResponseEntity.ok(
                leaveRequestRepository.save(leaveRequest)
        );
    }

    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaves() {

        return ResponseEntity.ok(leaveRequestRepository.findAll());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getEmployeeLeaves(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                leaveRequestRepository.findByEmployeeId(employeeId)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<LeaveRequest>> getLeavesByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                leaveRequestRepository.findByStatus(status)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveRequest> updateLeaveStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return leaveRequestRepository.findById(id)
                .map(leave -> {
                    leave.setStatus(status.toUpperCase());
                    return ResponseEntity.ok(
                            leaveRequestRepository.save(leave)
                    );
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
