package com.nexushr.employee.insights;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/insights")
public class WorkforceInsightController {

    private final WorkforceInsightService insightService;

    public WorkforceInsightController(
            WorkforceInsightService insightService) {
        this.insightService = insightService;
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<WorkforceInsight> getEmployeeInsight(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                insightService.generateInsight(employeeId)
        );
    }
}
