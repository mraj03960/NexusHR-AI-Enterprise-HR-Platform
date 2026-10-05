import { useEffect, useState } from "react";
import api from "./api";

type Insight = {
  employeeId: number;
  engagementScore: number;
  performanceScore: number;
  attritionRisk: string;
  recommendation: string;
};

export default function InsightsPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    api.get("/employees")
      .then(response => setEmployees(response.data))
      .catch(console.error);
  }, []);

  const loadInsight = async () => {
    if (!selectedEmployee) return;

    try {
      const response = await api.get(
        `/insights/employee/${selectedEmployee}`
      );
      setInsight(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="panel">
      <h2>Workforce Insights</h2>

      <div className="form-grid">
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Select Employee</option>

          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.employeeCode} - {employee.firstName} {employee.lastName}
            </option>
          ))}
        </select>
      </div>

      <button
        className="primary add-button"
        onClick={loadInsight}
      >
        Generate Insight
      </button>

      {insight && (
        <div className="panel">
          <h3>Employee Insight</h3>

          <p>
            <strong>Engagement Score:</strong>{" "}
            {insight.engagementScore.toFixed(1)}
          </p>

          <p>
            <strong>Performance Score:</strong>{" "}
            {insight.performanceScore.toFixed(1)}
          </p>

          <p>
            <strong>Attrition Risk:</strong>{" "}
            {insight.attritionRisk}
          </p>

          <p>
            <strong>Recommendation:</strong>{" "}
            {insight.recommendation}
          </p>
        </div>
      )}
    </section>
  );
}
