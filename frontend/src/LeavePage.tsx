import { useEffect, useState } from "react";
import api from "./api";

type Leave = {
  id?: number;
  employeeId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
};

function LeavePage() {
  const [records, setRecords] = useState<Leave[]>([]);

  const [form, setForm] = useState<Leave>({
    employeeId: 1,
    leaveType: "CASUAL",
    startDate: "",
    endDate: "",
    reason: "",
    status: "PENDING"
  });

  const [message, setMessage] = useState("");

  const loadLeaves = async () => {
    try {
      const response = await api.get("/leaves");
      setRecords(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const submitLeave = async () => {
    try {
      await api.post("/leaves", form);

      setMessage("Leave request submitted successfully.");

      setForm({
        employeeId: 1,
        leaveType: "CASUAL",
        startDate: "",
        endDate: "",
        reason: "",
        status: "PENDING"
      });

      loadLeaves();
    } catch (error) {
      console.error(error);
      setMessage("Failed to submit leave request.");
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(
        `/api/leaves/${id}/status?status=${status}`
      );

      setMessage(`Leave request ${status.toLowerCase()}.`);
      loadLeaves();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section className="panel">
        <h2>Apply for Leave</h2>

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

          <select
            value={form.leaveType}
            onChange={(e) =>
              setForm({
                ...form,
                leaveType: e.target.value
              })
            }
          >
            <option value="CASUAL">CASUAL</option>
            <option value="SICK">SICK</option>
            <option value="ANNUAL">ANNUAL</option>
            <option value="EMERGENCY">EMERGENCY</option>
          </select>

          <input
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm({
                ...form,
                startDate: e.target.value
              })
            }
          />

          <input
            type="date"
            value={form.endDate}
            onChange={(e) =>
              setForm({
                ...form,
                endDate: e.target.value
              })
            }
          />

          <input
            placeholder="Reason"
            value={form.reason}
            onChange={(e) =>
              setForm({
                ...form,
                reason: e.target.value
              })
            }
          />

        </div>

        <button className="primary add-button" onClick={submitLeave}>
          Submit Leave
        </button>

        {message && <p className="success">{message}</p>}
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>Leave Requests</h2>

          <button onClick={loadLeaves}>
            Refresh
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Type</th>
              <th>Start</th>
              <th>End</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.employeeId}</td>
                <td>{record.leaveType}</td>
                <td>{record.startDate}</td>
                <td>{record.endDate}</td>
                <td>{record.reason}</td>

                <td>
                  <span className="status">
                    {record.status}
                  </span>
                </td>

                <td>
                  {record.status === "PENDING" && (
                    <>
                      <button
                        className="action-button approve"
                        onClick={() =>
                          updateStatus(record.id!, "APPROVED")
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="action-button reject"
                        onClick={() =>
                          updateStatus(record.id!, "REJECTED")
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

export default LeavePage;
