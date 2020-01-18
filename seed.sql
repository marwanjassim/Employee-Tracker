USE employee_tracker;

------------- DEPARTMENTS ------------
INSERT INTO departments (id, name)
VALUES (1, "HR");
INSERT INTO departments (id, name)
VALUES (2, "Marketing");
INSERT INTO departments (id, name)
VALUES (3, "Accounting");
--------------- ROLES -----------------
-- This is a Manager in HR so department_id is 1
INSERT INTO roles (id, title, salary, department_id)
VALUES (1, "Manager", 80000.0, 1);
INSERT INTO roles (id, title, salary, department_id)
VALUES (2, "Employee", 45000.0, 1);
-- Marketing Department
INSERT INTO roles (id, title, salary, department_id)
VALUES (3, "Manager", 100000.0, 2);
INSERT INTO roles (id, title, salary, department_id)
VALUES (4, "Employee", 60000.0, 2);
-- Accounting 
INSERT INTO roles (id, title, salary, department_id)
VALUES (5, "Manager", 80000.0, 3);
INSERT INTO roles (id, title, salary, department_id)
VALUES (6, "Employee", 60000.0, 3);
--------------- EMPLOYEES ----------------
INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Marwan", "Jassim", 1, NULL);
INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (2, "Alex", "Guzman", 2, 1);
INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (3, "Jason", "Whitting", 2, 1);
INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (4, "Aaron", "White", 3, NULL);
INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (5, "Mary", "Jennings", 4, 4);
INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (6, "Beth", "Page", 4, 4);
INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (7, "Nancy", "McCloud", 5, NULL);
INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (8, "Mark", "Scott", 6, 7);
INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (9, "Bo", "Dane", 6, 7);



