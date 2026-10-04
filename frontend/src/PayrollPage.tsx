import { useEffect, useState } from "react";
import api from "./api";

type Payroll = {
  id?: number;
  employeeId: number;
  payrollMonth: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary?: number;
  status?: string;
};

function PayrollPage() {
  const [records, setRecords] = useState<Payroll[]>([]);

  const [form, setForm] = useState<Payroll>({
    employeeId: 1,
    payrollMonth: "",
    basicSalary: 0,
    allowances: 0,
    deductions: 0
  });

  const [message, setMessage] = useState("");

  const loadPayroll = async () => {
    try {
      const response = await api.get("/payroll");
      setRecords(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPayroll();
  }, []);

  const processPayroll = async () => {
    try {
      await api.post("/payroll", form);

      setMessage("Payroll processed successfully.");

      setForm({
        employeeId: 1,
        payrollMonth: "",
        basicSalary: 0,
        allowances: 0,
        deductions: 0
      });

      loadPayroll();
    } catch (error) {
      console.error(error);
      setMessage("Failed to process payroll.");
    }
  };

  const netSalary =
    Number(form.basicSalary || 0) +
    Number(form.allowances || 0) -
    Number(form.deductions || 0);

  return (
    <>
      <section className="panel">
        <h2>Process Payroll</h2>

        <div className="form-grid">

          <input
            type="number"
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={(e) =>
              setForm({
                ...form,
                employeeId: Number(e.target.value)
              })
            }
          />

          <input
            type="month"
            value={form.payrollMonth}
            onChange={(e) =>
              setForm({
                ...form,
                payrollMonth: e.target.value
              })
            }
          />

          <input
            type="number"
            placeholder="Basic Salary"
            value={form.basicSalary || ""}
            onChange={(e) =>
              setForm({
                ...form,
                basicSalary: Number(e.target.value)
              })
            }
          />

          <input
            type="number"
            placeholder="Allowances"
            value={form.allowances || ""}
            onChange={(e) =>
              setForm({
                ...form,
                allowances: Number(e.target.value)
              })
            }
          />

          <input
            type="number"
            placeholder="Deductions"
            value={form.deductions || ""}
            onChange={(e) =>
              setForm({
                ...form,
                deductions: Number(e.target.value)
              })
            }
          />

          <div className="salary-preview">
            Net Salary: ₹{netSalary.toLocaleString("en-IN")}
          </div>

        </div>

        <button
          className="primary add-button"
          onClick={processPayroll}
        >
          Process Payroll
        </button>

        {message && <p className="success">{message}</p>}
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>Payroll Records</h2>

          <button onClick={loadPayroll}>
            Refresh
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Month</th>
              <th>Basic Salary</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.employeeId}</td>
                <td>{record.payrollMonth}</td>
                <td>₹{record.basicSalary}</td>
                <td>₹{record.allowances}</td>
                <td>₹{record.deductions}</td>
                <td>
                  <strong>₹{record.netSalary}</strong>
                </td>
                <td>
                  <span className="status">
                    {record.status || "PROCESSED"}
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

export default PayrollPage;
