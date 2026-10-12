package com.nexushr.employee.insights;

import com.nexushr.employee.performance.PerformanceGoal;
import com.nexushr.employee.performance.PerformanceGoalRepository;
import com.nexushr.employee.performance.PerformanceReview;
import com.nexushr.employee.performance.PerformanceReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkforceInsightService {

    private final PerformanceGoalRepository goalRepository;
    private final PerformanceReviewRepository reviewRepository;

    public WorkforceInsightService(
            PerformanceGoalRepository goalRepository,
            PerformanceReviewRepository reviewRepository) {
        this.goalRepository = goalRepository;
        this.reviewRepository = reviewRepository;
    }

    public WorkforceInsight generateInsight(Long employeeId) {

        List<PerformanceGoal> goals =
                goalRepository.findByEmployeeId(employeeId);

        List<PerformanceReview> reviews =
                reviewRepository.findByEmployeeId(employeeId);

        double performanceScore = reviews.isEmpty()
                ? 0
                : reviews.stream()
                    .mapToInt(PerformanceReview::getRating)
                    .average()
                    .orElse(0) * 20;

        double goalScore = goals.isEmpty()
                ? 0
                : goals.stream()
                    .mapToInt(PerformanceGoal::getProgress)
                    .average()
                    .orElse(0);

        double engagementScore =
                (performanceScore + goalScore) / 2;

        String attritionRisk;

        if (engagementScore < 40) {
            attritionRisk = "HIGH";
        } else if (engagementScore < 70) {
            attritionRisk = "MEDIUM";
        } else {
            attritionRisk = "LOW";
        }

        String recommendation;

        if ("HIGH".equals(attritionRisk)) {
            recommendation =
                    "Schedule a manager discussion and create an employee development plan.";
        } else if ("MEDIUM".equals(attritionRisk)) {
            recommendation =
                    "Review employee goals and provide targeted coaching.";
        } else {
            recommendation =
                    "Maintain current development and recognition activities.";
        }

        return new WorkforceInsight(
                employeeId,
                engagementScore,
                performanceScore,
                attritionRisk,
                recommendation
        );
    }
}
