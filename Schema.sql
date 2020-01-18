DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;
USE employee_tracker;

CREATE TABLE departments(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE roles(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR (30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_department_id
    FOREIGN KEY (department_id)
      REFERENCES departments(id)
      ON DELETE CASCADE
);
CREATE TABLE employees(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL ,
    manager_id INT,
    PRIMARY KEY (id),
    CONSTRAINT fk_role_id
    FOREIGN KEY (role_id)
      REFERENCES roles(id)
      ON DELETE CASCADE,
    CONSTRAINT fk_manager_id
    FOREIGN KEY (manager_id)
      REFERENCES employees(id)
      ON DELETE CASCADE
);