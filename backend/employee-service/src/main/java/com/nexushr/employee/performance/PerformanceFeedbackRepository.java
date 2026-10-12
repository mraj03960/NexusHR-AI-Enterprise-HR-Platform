package com.nexushr.employee.performance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerformanceFeedbackRepository
        extends JpaRepository<PerformanceFeedback, Long> {

    List<PerformanceFeedback> findByEmployeeId(Long employeeId);
}
