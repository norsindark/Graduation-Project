package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.EmployeeDto;
import com.restaurant_management.entites.Employee;
import com.restaurant_management.entites.Role;
import com.restaurant_management.entites.User;
import com.restaurant_management.enums.RoleName;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.EmployeeResponse;
import com.restaurant_management.payloads.responses.GetEmailEmployeeResponse;
import com.restaurant_management.payloads.responses.GetEmailUserResponse;
import com.restaurant_management.repositories.EmployeeRepository;
import com.restaurant_management.repositories.EmployeeShiftRepository;
import com.restaurant_management.repositories.RoleRepository;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.services.interfaces.EmployeeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Component
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final EmployeeShiftRepository employeeShiftRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PagedResourcesAssembler<EmployeeResponse> pagedResourcesAssembler;

    @Override
    public List<GetEmailEmployeeResponse> getEmailsEmployee() throws DataExitsException {
        List<User> users = userRepository.findByRoleName(RoleName.EMPLOYEE.toString());
        List<Employee> employees = employeeRepository.findAll();
        if (users.isEmpty()) {
            throw new DataExitsException("No user found");
        }
        List<GetEmailEmployeeResponse> getEmailEmployeeResponses = new ArrayList<>();
        for (User user : users) {
            for (Employee employee : employees) {
                if (user.getId().equals(employee.getUser().getId())) {
                    getEmailEmployeeResponses.add(new GetEmailEmployeeResponse(
                            user.getEmail(),
                            employee.getEmployeeName(),
                            employee.getId()));
                }
            }
        }
        return getEmailEmployeeResponses;
    }

    @Override
    public List<GetEmailUserResponse> getEmailsUser() throws DataExitsException {
        List<User> users = userRepository.findByRoleName(RoleName.USER.toString());
        if (users.isEmpty()) {
            throw new DataExitsException("No user found");
        }
        List<GetEmailUserResponse> getEmailEmployeeResponses = new ArrayList<>();
        for (User user : users) {
            if (user.getRole().getName().equals(RoleName.USER.toString())) {
                getEmailEmployeeResponses.add(new GetEmailUserResponse(user.getEmail(), user.getFullName()));
            }
        }
        return getEmailEmployeeResponses;
    }

    @Override
    @Transactional
    public ApiResponse addEmployee(EmployeeDto employeeDto) throws DataExitsException {
        List<String> emailList = employeeDto.getEmails();
        List<String> existingEmails = new ArrayList<>();

        for (String email : emailList) {
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                String userRole = userOptional.get().getRole().getName();
                if (userRole.equals(RoleName.EMPLOYEE.toString())) {
                    existingEmails.add(email);
                    continue;
                }
                if (userRole.equals(RoleName.ADMIN.toString())) {
                    throw new DataExitsException("User " + email + " is an admin");
                }

                Employee _employee = Employee.builder()
                        .employeeName(userOptional.get().getFullName())
                        .salary(employeeDto.getSalary())
                        .jobTitle(employeeDto.getJobTitle())
                        .user(userOptional.get())
                        .build();

                this.employeeRepository.save(_employee);

                Role role = roleRepository.findByName(RoleName.EMPLOYEE.toString());
                User user = userOptional.get();
                user.setRole(role);
                userRepository.save(user);
            } else {
                throw new DataExitsException("User with email: " + email + " not found");
            }
        }

        if (!existingEmails.isEmpty()) {
            throw new DataExitsException("Employee with email: " + existingEmails + " already exists");
        }

        return new ApiResponse("Employees added successfully", HttpStatus.CREATED);
    }



    @Override
    public EmployeeResponse getEmployeeById(String employeeId) throws DataExitsException {
        Optional<Employee> employeeOptional = employeeRepository.findById(employeeId);
        if (employeeOptional.isEmpty()) {
            throw new DataExitsException("Employee not found");
        }
        return new EmployeeResponse(employeeOptional.get());
    }

    @Override
    public PagedModel<EntityModel<EmployeeResponse>> getAllEmployees(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException {

        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));

        Page<Employee> pagedResult = employeeRepository.findAll(paging);
        if (pagedResult.hasContent()) {
            return pagedResourcesAssembler.toModel(pagedResult.map(EmployeeResponse::new));
        } else {
            throw new DataExitsException("No Employee found");
        }
    }

    @Override
    @Transactional
    public ApiResponse updateEmployee(EmployeeDto employeeDto) throws DataExitsException {
        Optional<Employee> employeeOptional = employeeRepository.findById(employeeDto.getEmployeeId());
        if (employeeOptional.isEmpty()) {
            throw new DataExitsException("Employee not found");
        }
        Employee _employee = employeeOptional.get();
        _employee.setEmployeeName(employeeDto.getEmployeeName());
        _employee.setSalary(employeeDto.getSalary());
        _employee.setJobTitle(employeeDto.getJobTitle());
        employeeRepository.save(_employee);
        return new ApiResponse("Employee updated successfully", HttpStatus.OK);
    }

    @Override
    @Transactional
    public ApiResponse deleteEmployee(String employeeId) throws DataExitsException {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new DataExitsException("Employee not found"));

        User user = employee.getUser();
        if (user == null) {
            throw new DataExitsException("User not found");
        }

        employeeShiftRepository.deleteByEmployeeId(employeeId);
        employeeRepository.deleteByEmployeeId(employeeId);

        Role role = roleRepository.findByName(RoleName.USER.toString());
        user.setRole(role);
        userRepository.save(user);
        return new ApiResponse("Employee deleted successfully", HttpStatus.OK);
    }
}
