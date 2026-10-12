package com.nexushr.employee.insights;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/insights")
public class SkillGapController {

    private final EmployeeSkillRepository skillRepository;

    public SkillGapController(EmployeeSkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @PostMapping("/skills")
    public ResponseEntity<EmployeeSkill> addSkill(
            @RequestBody EmployeeSkill skill) {

        if (skill.getProficiency() < 1 ||
                skill.getProficiency() > 5) {
            throw new IllegalArgumentException(
                    "Proficiency must be between 1 and 5"
            );
        }

        return ResponseEntity.ok(skillRepository.save(skill));
    }

    @GetMapping("/skills/employee/{employeeId}")
    public ResponseEntity<List<EmployeeSkill>> getSkills(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                skillRepository.findByEmployeeId(employeeId)
        );
    }

    @GetMapping("/skill-gap/{employeeId}")
    public ResponseEntity<Map<String, Object>> getSkillGap(
            @PathVariable Long employeeId) {

        List<EmployeeSkill> skills =
                skillRepository.findByEmployeeId(employeeId);

        List<String> requiredSkills = List.of(
                "Java",
                "SQL",
                "Spring Boot",
                "REST API"
        );

        List<String> currentSkills = skills.stream()
                .map(EmployeeSkill::getSkillName)
                .map(String::toLowerCase)
                .toList();

        List<String> skillGaps = requiredSkills.stream()
                .filter(required ->
                        !currentSkills.contains(required.toLowerCase()))
                .toList();

        return ResponseEntity.ok(
                Map.of(
                        "employeeId", employeeId,
                        "requiredSkills", requiredSkills,
                        "currentSkills", skills,
                        "skillGaps", skillGaps
                )
        );
    }
}
