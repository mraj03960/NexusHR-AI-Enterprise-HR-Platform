import { useEffect, useState } from "react";
import api from "./api";

type Analytics = {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departmentDistribution: Record<string, number>;
};

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    api.get("/analytics/workforce")
      .then((response) => setAnalytics(response.data))
      .catch(console.error);
  }, []);

  if (!analytics) {
    return (
      <section className="panel">
        <h2>Workforce Analytics</h2>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Workforce Analytics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <p>{analytics.totalEmployees}</p>
        </div>

        <div className="stat-card">
          <h3>Active Employees</h3>
          <p>{analytics.activeEmployees}</p>
        </div>

        <div className="stat-card">
          <h3>Inactive Employees</h3>
          <p>{analytics.inactiveEmployees}</p>
        </div>
      </div>

      <h3>Department Distribution</h3>

      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Employees</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(analytics.departmentDistribution).map(
            ([department, count]) => (
              <tr key={department}>
                <td>{department}</td>
                <td>{count}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </section>
  );
}
