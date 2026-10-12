package com.nexushr.employee.insights;

public class WorkforceInsight {

    private Long employeeId;
    private double engagementScore;
    private double performanceScore;
    private String attritionRisk;
    private String recommendation;

    public WorkforceInsight(
            Long employeeId,
            double engagementScore,
            double performanceScore,
            String attritionRisk,
            String recommendation) {

        this.employeeId = employeeId;
        this.engagementScore = engagementScore;
        this.performanceScore = performanceScore;
        this.attritionRisk = attritionRisk;
        this.recommendation = recommendation;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public double getEngagementScore() {
        return engagementScore;
    }

    public double getPerformanceScore() {
        return performanceScore;
    }

    public String getAttritionRisk() {
        return attritionRisk;
    }

    public String getRecommendation() {
        return recommendation;
    }
}
