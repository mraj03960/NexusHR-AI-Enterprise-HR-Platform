package com.nexushr.employee.service;

import com.nexushr.employee.entity.Employee;
import com.nexushr.employee.entity.Role;
import com.nexushr.employee.repository.EmployeeRepository;
import com.nexushr.employee.repository.RoleRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            RoleRepository roleRepository) {
        this.employeeRepository = employeeRepository;
        this.roleRepository = roleRepository;
    }

    @CacheEvict(value = "employees", allEntries = true)
    public Employee createEmployee(Employee employee) {

        if (employee.getRole() != null && employee.getRole().getId() != null) {

            Role role = roleRepository.findById(employee.getRole().getId())
                    .orElseThrow(() -> new RuntimeException("Role not found"));

            employee.setRole(role);
        }

        return employeeRepository.save(employee);
    }

    @Cacheable("employees")
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public Optional<Employee> getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }

    @CacheEvict(value = "employees", allEntries = true)
    public Employee updateEmployee(Employee employee) {

        if (employee.getRole() != null && employee.getRole().getId() != null) {

            Role role = roleRepository.findById(employee.getRole().getId())
                    .orElseThrow(() -> new RuntimeException("Role not found"));

            employee.setRole(role);
        }

        return employeeRepository.save(employee);
    }

    @CacheEvict(value = "employees", allEntries = true)
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}
