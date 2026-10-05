import { useEffect, useState } from "react";
import api from "./api";
import "./index.css";
import AttendancePage from "./AttendancePage";
import LeavePage from "./LeavePage";
import PayrollPage from "./PayrollPage";
import DashboardPage from "./DashboardPage";



type Employee = {
  id?: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  employmentStatus: string;
  role?: {
    id: number;
    name?: string;
  };
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  const [role, setRole] = useState(
  localStorage.getItem("role") || ""
);

  const normalizedRole = role.toUpperCase();

  const canManageEmployees =
    normalizedRole === "ADMIN" ||
    normalizedRole === "HR";

  const canViewEmployees =
    normalizedRole === "ADMIN" ||
    normalizedRole === "HR" ||
    normalizedRole === "MANAGER";

  const canViewPayroll =
    normalizedRole === "ADMIN" ||
    normalizedRole === "HR" ||
    normalizedRole === "MANAGER";
  const [page, setPage] = useState("dashboard");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [message, setMessage] = useState("");

  const [loginUsername, setLoginUsername] = useState("admin");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [form, setForm] = useState<Employee>({
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    designation: "",
    joiningDate: "",
    employmentStatus: "ACTIVE"
  });

  const loadEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      loadEmployees();
    }
  }, [token]);

  const login = async () => {
    try {
      setLoginError("");

      const response = await api.post("/auth/login", {
        username: loginUsername,
        password: loginPassword
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);

      setToken(response.data.token);
      setUsername(response.data.username);
      setRole(response.data.role);
    } catch {
      setLoginError("Invalid username or password");
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUsername("");
    setRole("");
  };

  const createEmployee = async () => {
    try {
      await api.post("/employees", form);

      setMessage("Employee created successfully.");

      setForm({
        employeeCode: "",
        firstName: "",
        lastName: "",
        email: "",
        department: "",
        designation: "",
        joiningDate: "",
        employmentStatus: "ACTIVE"
      });

      await loadEmployees();
    } catch (error) {
      console.error(error);
      setMessage("Failed to create employee.");
    }
  };

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="logo">N</div>
          <h1>NexusHR</h1>
          <p>Enterprise HR & Workforce Intelligence</p>

          <input
            placeholder="Username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          {loginError && <div className="error">{loginError}</div>}

          <button className="primary" onClick={login}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">

      <aside className="sidebar">
        <div className="brand">
          <div className="logo small">N</div>
          <span>NexusHR</span>
        </div>

        <button
          className={page === "dashboard" ? "nav active" : "nav"}
          onClick={() => setPage("dashboard")}
        >
          🏠 Dashboard
        </button>

        {canViewEmployees && (

        <button
          className={page === "employees" ? "nav active" : "nav"}
          onClick={() => setPage("employees")}
        >
          👥 Employees
        </button>

        )}

        <button
          className={page === "attendance" ? "nav active" : "nav"}
          onClick={() => setPage("attendance")}
        >
          🕒 Attendance
        </button>

        <button
          className={page === "leaves" ? "nav active" : "nav"}
          onClick={() => setPage("leaves")}
        >
          📅 Leave
        </button>

        {canViewPayroll && (


          <button


            className={page === "payroll" ? "nav active" : "nav"}


            onClick={() => setPage("payroll")}


          >


            💰 Payroll


          </button>


        )}

        <button className="logout" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="content">

        <header>
          <div>
            <h1>
              {page === "dashboard"
                ? "Dashboard"
                : page === "employees"
                ? "Employee Management"
                : page.charAt(0).toUpperCase() + page.slice(1)}
            </h1>

            <p>Welcome back, {username}</p>
          </div>

          <div className="user-badge">{role}</div>
        </header>

        {page === "dashboard" && <DashboardPage />}

        {page === "employees" && canViewEmployees && (
          <>
            {canManageEmployees && (
            <section className="panel">
            <h2>Add Employee</h2>

                          <div className="form-grid">
                            <input placeholder="Employee Code" value={form.employeeCode} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} />
                            <input placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                            <input placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                            <input placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
                            <input type="date" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} />
                            <select value={form.employmentStatus} onChange={(e) => setForm({ ...form, employmentStatus: e.target.value })}>
                              <option value="ACTIVE">ACTIVE</option>
                              <option value="INACTIVE">INACTIVE</option>
                            </select>
                          </div>
                          <button className="primary add-button" onClick={createEmployee}>
                            Add Employee
                          </button>
                          {message && <p className="success">{message}</p>}
                        </section>
                      )}
            <section className="panel">
              <div className="panel-title">
                <h2>Employees</h2>

                <button onClick={loadEmployees}>
                  Refresh
                </button>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((employee) => (
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
        )}

        {page === "attendance" && <AttendancePage />}

        {page === "leaves" && <LeavePage />}

        {page === "payroll" && <PayrollPage />}

      </main>
    </div>
  );
}

export default App;
