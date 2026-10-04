package com.nexushr.payroll.controller;

import com.nexushr.payroll.entity.Payroll;
import com.nexushr.payroll.repository.PayrollRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    private final PayrollRepository payrollRepository;

    public PayrollController(PayrollRepository payrollRepository) {
        this.payrollRepository = payrollRepository;
    }

    @PostMapping
    public ResponseEntity<Payroll> createPayroll(
            @RequestBody Payroll payroll) {

        BigDecimal netSalary = payroll.getBasicSalary()
                .add(payroll.getAllowances())
                .subtract(payroll.getDeductions());

        payroll.setNetSalary(netSalary);

        return ResponseEntity.ok(payrollRepository.save(payroll));
    }

    @GetMapping
    public ResponseEntity<List<Payroll>> getAllPayroll() {
        return ResponseEntity.ok(payrollRepository.findAll());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Payroll>> getEmployeePayroll(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                payrollRepository.findByEmployeeId(employeeId)
        );
    }

    @GetMapping("/month/{month}")
    public ResponseEntity<List<Payroll>> getPayrollByMonth(
            @PathVariable String month) {

        return ResponseEntity.ok(
                payrollRepository.findByPayrollMonth(month)
        );
    }
}
