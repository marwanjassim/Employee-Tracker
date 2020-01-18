DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;
USE employee_tracker;

CREATE TABLE employees(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL ,
    manager_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_role_id
    FOREIGN KEY (role_id)
      REFERENCES roles(id),
    CONSTRAINT fk_manager_id
    FOREIGN KEY (manager_id)
      REFERENCES employees(id),
)
CREATE TABLE
