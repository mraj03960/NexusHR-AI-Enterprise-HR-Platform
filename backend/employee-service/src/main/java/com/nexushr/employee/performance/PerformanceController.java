package com.nexushr.employee.performance;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/performance")
public class PerformanceController {

    private final PerformanceGoalRepository goalRepository;
    private final PerformanceReviewRepository reviewRepository;
    private final PerformanceFeedbackRepository feedbackRepository;

    public PerformanceController(
            PerformanceGoalRepository goalRepository,
            PerformanceReviewRepository reviewRepository,
            PerformanceFeedbackRepository feedbackRepository) {
        this.goalRepository = goalRepository;
        this.reviewRepository = reviewRepository;
        this.feedbackRepository = feedbackRepository;
    }

    @PostMapping("/goals")
    public ResponseEntity<PerformanceGoal> createGoal(
            @RequestBody PerformanceGoal goal) {
        return ResponseEntity.ok(goalRepository.save(goal));
    }

    @GetMapping("/goals/employee/{employeeId}")
    public ResponseEntity<List<PerformanceGoal>> getGoals(
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(
                goalRepository.findByEmployeeId(employeeId)
        );
    }

    @PutMapping("/goals/{id}/progress")
    public ResponseEntity<PerformanceGoal> updateProgress(
            @PathVariable Long id,
            @RequestParam Integer progress) {

        PerformanceGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (progress < 0 || progress > 100) {
            throw new IllegalArgumentException(
                    "Progress must be between 0 and 100"
            );
        }

        goal.setProgress(progress);
        goal.setStatus(progress == 100 ? "COMPLETED" : "IN_PROGRESS");

        return ResponseEntity.ok(goalRepository.save(goal));
    }

    @PostMapping("/reviews")
    public ResponseEntity<PerformanceReview> createReview(
            @RequestBody PerformanceReview review) {
        return ResponseEntity.ok(reviewRepository.save(review));
    }

    @GetMapping("/reviews/employee/{employeeId}")
    public ResponseEntity<List<PerformanceReview>> getReviews(
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(
                reviewRepository.findByEmployeeId(employeeId)
        );
    }

    @PostMapping("/feedback")
    public ResponseEntity<PerformanceFeedback> createFeedback(
            @RequestBody PerformanceFeedback feedback) {
        return ResponseEntity.ok(feedbackRepository.save(feedback));
    }

    @GetMapping("/feedback/employee/{employeeId}")
    public ResponseEntity<List<PerformanceFeedback>> getFeedback(
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(
                feedbackRepository.findByEmployeeId(employeeId)
        );
    }
}
