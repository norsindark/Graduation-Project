package com.restaurant_management.repositories;
import com.restaurant_management.entites.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, String> {

    @Query("SELECT e FROM Employee e WHERE e.id IN :ids")
    List<Employee> findAllEmployeeById(@Param("ids") List<String> ids);
}
