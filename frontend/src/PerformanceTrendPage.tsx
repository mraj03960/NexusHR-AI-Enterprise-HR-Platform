import { useEffect, useState } from "react";
import api from "./api";

type Trend = {
  reviewPeriod: string;
  rating: number;
  reviewDate: string;
};

export default function PerformanceTrendPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [trend, setTrend] = useState<Trend[]>([]);

  useEffect(() => {
    api.get("/employees")
      .then((response) => setEmployees(response.data))
      .catch(console.error);
  }, []);

  const loadTrend = async () => {
    if (!employeeId) return;

    try {
      const response = await api.get(
        `/performance/trend/${employeeId}`
      );
      setTrend(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="panel">
      <h2>Performance Trend Analysis</h2>

      <select
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      >
        <option value="">Select Employee</option>

        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.firstName} {employee.lastName}
          </option>
        ))}
      </select>

      <button onClick={loadTrend}>
        Analyze Trend
      </button>

      {trend.length === 0 ? (
        <p>No performance review history available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Review Period</th>
              <th>Rating</th>
              <th>Score</th>
              <th>Review Date</th>
            </tr>
          </thead>

          <tbody>
            {trend.map((item, index) => (
              <tr key={index}>
                <td>{item.reviewPeriod}</td>
                <td>{item.rating}/5</td>
                <td>{item.rating * 20}%</td>
                <td>{item.reviewDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
