package com.nexushr.employee.performance;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PerformanceGoalRepository
        extends JpaRepository<PerformanceGoal, Long> {

    List<PerformanceGoal> findByEmployeeId(Long employeeId);
}
