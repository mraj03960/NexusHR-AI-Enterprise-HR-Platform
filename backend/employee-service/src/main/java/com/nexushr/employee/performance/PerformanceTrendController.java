package com.nexushr.employee.performance;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/performance")
public class PerformanceTrendController {

    private final PerformanceReviewRepository repository;

    public PerformanceTrendController(PerformanceReviewRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/trend/{employeeId}")
    public List<Map<String, Object>> getTrend(@PathVariable Long employeeId) {

        return repository.findByEmployeeIdOrderByReviewDateAsc(employeeId)
                .stream()
                .map(review -> Map.<String, Object>of(
                        "reviewPeriod", review.getReviewPeriod(),
                        "rating", review.getRating(),
                        "reviewDate", review.getReviewDate()
                ))
                .toList();
    }
}
