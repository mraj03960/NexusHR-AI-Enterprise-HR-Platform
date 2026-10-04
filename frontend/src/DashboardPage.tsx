import { useEffect, useState } from "react";
import api from "./api";

function DashboardPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);

  const loadDashboard = async () => {
    try {
      const [employeesRes, attendanceRes, leavesRes, payrollRes] =
        await Promise.all([
          api.get("/employees"),
          api.get("/attendance"),
          api.get("/leaves"),
          api.get("/payroll")
        ]);

      setEmployees(employeesRes.data);
      setAttendance(attendanceRes.data);
      setLeaves(leavesRes.data);
      setPayroll(payrollRes.data);
    } catch (error) {
      console.error("Dashboard loading failed:", error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "PENDING"
  ).length;

  const processedPayroll = payroll.filter(
    (item) => item.status === "PROCESSED"
  ).length;

  return (
    <>
      <section className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Total Employees</h3>
          <div className="dashboard-number">
            {employees.length}
          </div>
          <p>Registered employees</p>
        </div>

        <div className="dashboard-card">
          <h3>Attendance</h3>
          <div className="dashboard-number">
            {attendance.length}
          </div>
          <p>Attendance records</p>
        </div>

        <div className="dashboard-card">
          <h3>Leave Requests</h3>
          <div className="dashboard-number">
            {leaves.length}
          </div>
          <p>{pendingLeaves} pending approval</p>
        </div>

        <div className="dashboard-card">
          <h3>Payroll</h3>
          <div className="dashboard-number">
            {processedPayroll}
          </div>
          <p>Processed payroll records</p>
        </div>

      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>Recent Employees</h2>

          <button onClick={loadDashboard}>
            Refresh
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Employee Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {employees.slice(-5).reverse().map((employee) => (
              <tr key={employee.id}>
                <td>{employee.employeeCode}</td>
                <td>
                  {employee.firstName} {employee.lastName}
                </td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>{employee.designation}</td>
                <td>
                  <span className="status">
                    {employee.employmentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

export default DashboardPage;
