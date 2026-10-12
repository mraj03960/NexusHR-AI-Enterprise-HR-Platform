package com.nexushr.employee.insights;

import com.nexushr.employee.entity.Employee;
import com.nexushr.employee.repository.EmployeeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AdminAnalyticsController {

    private final EmployeeRepository employeeRepository;

    public AdminAnalyticsController(
            EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/workforce")
    public ResponseEntity<Map<String, Object>> workforceAnalytics() {

        var employees = employeeRepository.findAll();

        long totalEmployees = employees.size();

        long activeEmployees = employees.stream()
                .filter(employee ->
                        "ACTIVE".equalsIgnoreCase(
                                employee.getEmploymentStatus()))
                .count();

        Map<String, Long> departmentCounts = new LinkedHashMap<>();

        employees.forEach(employee -> {
            String department = employee.getDepartment();

            if (department == null || department.isBlank()) {
                department = "Unassigned";
            }

            departmentCounts.merge(department, 1L, Long::sum);
        });

        Map<String, Object> result = new LinkedHashMap<>();

        result.put("totalEmployees", totalEmployees);
        result.put("activeEmployees", activeEmployees);
        result.put("inactiveEmployees",
                totalEmployees - activeEmployees);
        result.put("departmentDistribution", departmentCounts);

        return ResponseEntity.ok(result);
    }
}
