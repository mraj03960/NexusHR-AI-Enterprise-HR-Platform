import { useEffect, useState } from "react";
import api from "./api";

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
};

type SkillGap = {
  currentSkills: string[];
  skillGaps: string[];
};

export default function SkillGapPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [skillName, setSkillName] = useState("");
  const [proficiency, setProficiency] = useState(1);
  const [result, setResult] = useState<SkillGap | null>(null);

  useEffect(() => {
    api.get("/employees")
      .then((response) => setEmployees(response.data))
      .catch(console.error);
  }, []);

  const addSkill = async () => {
    if (!employeeId || !skillName) return;

    await api.post("/insights/skills", {
      employeeId: Number(employeeId),
      skillName,
      proficiency
    });

    setSkillName("");
  };

  const analyze = async () => {
    if (!employeeId) return;

    const response = await api.get(
      `/insights/skill-gap/${employeeId}`
    );

    setResult(response.data);
  };

  return (
    <section className="panel">
      <h2>Skill Gap Analysis</h2>

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

      <div className="form-grid">
        <input
          placeholder="Skill name"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
        />

        <input
          type="number"
          min="1"
          max="5"
          value={proficiency}
          onChange={(e) => setProficiency(Number(e.target.value))}
        />

        <button onClick={addSkill}>Add Skill</button>
        <button onClick={analyze}>Analyze Skill Gap</button>
      </div>

      {result && (
        <div>
          <h3>Current Skills</h3>
          <ul>
            {result.currentSkills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>

          <h3>Skill Gaps</h3>
          <ul>
            {result.skillGaps.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
