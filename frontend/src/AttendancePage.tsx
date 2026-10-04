import { useEffect, useState } from "react";
import api from "./api";

type Attendance = {
  id?: number;
  employeeId: number;
  attendanceDate: string;
  checkIn: string;
  checkOut: string;
  status: string;
};

function AttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);

  const [form, setForm] = useState<Attendance>({
    employeeId: 1,
    attendanceDate: "",
    checkIn: "",
    checkOut: "",
    status: "PRESENT"
  });

  const [message, setMessage] = useState("");

  const loadAttendance = async () => {
    try {
      const response = await api.get("/attendance");
      setRecords(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const markAttendance = async () => {
    try {
      await api.post("/attendance", form);

      setMessage("Attendance marked successfully.");

      setForm({
        employeeId: 1,
        attendanceDate: "",
        checkIn: "",
        checkOut: "",
        status: "PRESENT"
      });

      loadAttendance();
    } catch (error) {
      console.error(error);
      setMessage("Failed to mark attendance.");
    }
  };

  return (
    <>
      <section className="panel">
        <h2>Mark Attendance</h2>

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
            type="date"
            value={form.attendanceDate}
            onChange={(e) =>
              setForm({
                ...form,
                attendanceDate: e.target.value
              })
            }
          />

          <input
            type="time"
            value={form.checkIn}
            onChange={(e) =>
              setForm({
                ...form,
                checkIn: e.target.value
              })
            }
          />

          <input
            type="time"
            value={form.checkOut}
            onChange={(e) =>
              setForm({
                ...form,
                checkOut: e.target.value
              })
            }
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value
              })
            }
          >
            <option value="PRESENT">PRESENT</option>
            <option value="ABSENT">ABSENT</option>
            <option value="HALF_DAY">HALF DAY</option>
            <option value="ON_LEAVE">ON LEAVE</option>
          </select>

        </div>

        <button className="primary add-button" onClick={markAttendance}>
          Mark Attendance
        </button>

        {message && <p className="success">{message}</p>}
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>Attendance Records</h2>

          <button onClick={loadAttendance}>
            Refresh
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.employeeId}</td>
                <td>{record.attendanceDate}</td>
                <td>{record.checkIn}</td>
                <td>{record.checkOut}</td>
                <td>
                  <span className="status">
                    {record.status}
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

export default AttendancePage;
