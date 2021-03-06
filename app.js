var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "employee_tracker"
});

connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What do you like to do?",
      choices: [
        { name: "View all employees", value: "viewEmployees" },
        { name: "View all roles", value: "viewRoles" },
        { name: "View all departments", value: "viewDepartments" },
        {
          name: "View all employees by Department",
          value: "viewEmployeesByDepartment"
        },
        {
          name: "View all employees by Manager",
          value: "viewEmployeesByManager"
        },
        { name: "Add employee", value: "addEmployee" },
        { name: "Add role", value: "addRole" },
        { name: "Add department", value: "addDepartment" },

        { name: "Remove employee", value: "removeEmployee" },
        { name: "Remove role", value: "removeRole" },
        { name: "Remove department", value: "removeDepartment" },
        { name: "Update employee Role", value: "updateEmployeeRole" },
        { name: "Exit", value: "exit" }
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "viewEmployees":
          viewEmployees();
          break;
        case "viewRoles":
          viewRoles();
          break;
        case "viewDepartments":
          viewDepartments();
          break;
        case "viewEmployeesByDepartment":
          viewEmployeesByDepartment();
          break;
        case "viewEmployeesByManager":
          viewEmployeesByManager();
          break;
        case "addEmployee":
          addEmployee();
          break;
        case "addRole":
          addRole();
          break;
        case "addDepartment":
          addDepartment();
          break;
        case "removeEmployee":
          removeEmployee();
          break;
        case "removeRole":
          removeRole();
          break;
        case "removeDepartment":
          removeDepartment();
          break;
        case "updateEmployeeRole":
          updateEmployeeRole();
          break;
        case "exit":
          process.exit();
          break;
      }
    });
}

function viewEmployees() {
  connection.query(
    "SELECT e.id, e.first_name, e.last_name, roles.title, roles.salary, departments.name as department_name, CONCAT_WS(' ', m.first_name, m.last_name) as manager FROM employees e INNER JOIN roles ON e.role_id=roles.id INNER JOIN departments ON roles.department_id=departments.id LEFT JOIN employees m on e.manager_id=m.id",
    function(err, res) {
      if (err) throw err;
      console.log(cTable.getTable(res));
      start();
    }
  );
}

function viewRoles() {
  connection.query(
    `SELECT roles.id, roles.title, roles.salary, departments.name as department_name
     FROM roles
     INNER JOIN departments ON roles.department_id=departments.id`,
    function(err, res) {
      if (err) throw err;
      console.log(cTable.getTable(res));
      start();
    }
  );
}

function viewDepartments() {
  connection.query(`SELECT id, name FROM departments`, function(err, res) {
    if (err) throw err;
    console.log(cTable.getTable(res));
    start();
  });
}

function viewEmployeesByDepartment() {
  connection.query("SELECT * FROM departments", function(err, res) {
    if (err) throw err;
    // map sql name and id to choice name and value
    var departmentChoices = res.map(function(item) {
      return { name: item.name, value: item.id };
    });
    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "Choose a department",
        choices: departmentChoices
      })
      .then(function(answer) {
        connection.query(
          `SELECT e.id, e.first_name, e.last_name, roles.title, roles.salary, CONCAT_WS(' ', m.first_name, m.last_name) as manager
              FROM employees e
              INNER JOIN roles ON e.role_id=roles.id AND roles.department_id=${answer.department}
              LEFT JOIN employees m on e.manager_id=m.id`,
          function(err, res) {
            if (err) throw err;
            console.log(cTable.getTable(res));
            start();
          }
        );
      });
  });
}

function viewEmployeesByDepartment() {
  connection.query("SELECT name, id as value FROM departments", function(
    err,
    res
  ) {
    if (err) throw err;
    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "Choose a department",
        choices: res
      })
      .then(function(answer) {
        connection.query(
          `SELECT e.id, e.first_name, e.last_name, roles.title, roles.salary, CONCAT_WS(' ', m.first_name, m.last_name) as manager
              FROM employees e
              INNER JOIN roles ON e.role_id=roles.id AND roles.department_id=${answer.department}
              LEFT JOIN employees m on e.manager_id=m.id`,
          function(err, res) {
            if (err) throw err;
            console.log(cTable.getTable(res));
            start();
          }
        );
      });
  });
}

function viewEmployeesByManager() {
  connection.query(
    `SELECT DISTINCT CONCAT_WS(' ', m.first_name, m.last_name) as name, m.id as value
  FROM employees m
  INNER JOIN employees e ON m.id=e.manager_id`,
    function(err, res) {
      if (err) throw err;
      inquirer
        .prompt({
          name: "manager",
          type: "list",
          message: "Choose a manager",
          choices: res
        })
        .then(function(answer) {
          connection.query(
            `SELECT e.id, e.first_name, e.last_name, roles.title, roles.salary
            FROM employees e
            INNER JOIN roles ON e.role_id=roles.id
            WHERE e.manager_id=${answer.manager}`,
            function(err, res) {
              if (err) throw err;
              console.log(cTable.getTable(res));
              start();
            }
          );
        });
    }
  );
}
function addDepartment() {
  inquirer
    .prompt({
      name: "name",
      type: "text",
      message: "What is the department name?"
    })
    .then(function(answer) {
      connection.query(
        `INSERT INTO departments (name) VALUES ("${answer.name}")`,
        function(err, res) {
          if (err) throw err;
          start();
        }
      );
    });
}

function addRole() {
  connection.query("SELECT name, id as value FROM departments", function(
    err,
    res
  ) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "department",
          type: "list",
          message: "What is the role's department?",
          choices: res
        },
        {
          name: "title",
          type: "text",
          message: "What is the role's title?"
        },
        {
          name: "salary",
          type: "number",
          message: "What is the role's salary?"
        }
      ])
      .then(function(answer) {
        connection.query(
          `INSERT INTO roles (title, salary, department_id)
          VALUES ("${answer.title}", ${answer.salary}, ${answer.department})`,
          function(err, res) {
            if (err) throw err;
            start();
          }
        );
      });
  });
}

function addEmployee() {
  connection.query("SELECT title as name, id as value FROM roles", function(
    err,
    rolesResult
  ) {
    if (err) throw err;
    connection.query(
      `SELECT CONCAT_WS(' ', m.first_name, m.last_name) as name, m.id as value
        FROM employees m`,
      function(err, employeesResult) {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: "hasManager",
              type: "confirm",
              message: "Does this employee have a manager?"
            },
            {
              name: "manager",
              type: "list",
              message: "What is the employee's manager?",
              choices: employeesResult,
              when: function(answers) {
                return answers.hasManager;
              }
            },
            {
              name: "role",
              type: "list",
              message: "What is the employee's role?",
              choices: rolesResult
            },
            {
              name: "firstName",
              type: "text",
              message: "What is the employee's first name?"
            },
            {
              name: "lastName",
              type: "text",
              message: "What is the employee's last name?"
            }
          ])
          .then(function(answers) {
            var managerID = "NULL";
            // If user picked a manager, assign the id
            if (answers.hasManager) {
              managerID = answers.manager;
            }
            connection.query(
              `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                  VALUES ("${answers.firstName}", "${answers.lastName}", ${answers.role}, ${managerID})`,
              function(err, res) {
                if (err) throw err;
                start();
              }
            );
          });
      }
    );
  });
}

function updateEmployeeRole() {
  connection.query("SELECT title as name, id as value FROM roles", function(
    err,
    rolesResult
  ) {
    if (err) throw err;
    connection.query(
      `SELECT CONCAT_WS(' ', m.first_name, m.last_name) as name, m.id as value
        FROM employees m`,
      function(err, employeesResult) {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: "employee",
              type: "list",
              message: "What employee would you like to update?",
              choices: employeesResult
            },
            {
              name: "role",
              type: "list",
              message: "What is the employee's role?",
              choices: rolesResult
            }
          ])
          .then(function(answers) {
            connection.query(
              `UPDATE employees SET role_id=${answers.role} WHERE id=${answers.employee}`,
              function(err, res) {
                if (err) throw err;
                start();
              }
            );
          });
      }
    );
  });
}

function removeEmployee() {
  connection.query(
    `SELECT CONCAT_WS(' ', m.first_name, m.last_name) as name, m.id as value
        FROM employees m`,
    function(err, employeesResult) {
      if (err) throw err;
      inquirer
        .prompt({
          name: "employee",
          type: "list",
          message: "Which employee would you like to remove?",
          choices: employeesResult
        })
        .then(function(answers) {
          connection.query(
            `DELETE FROM employees WHERE employees.id=${answers.employee}`,
            function(err, res) {
              if (err) throw err;
              start();
            }
          );
        });
    }
  );
}

function removeRole() {
  connection.query(`SELECT title as name, id as value FROM roles`, function(
    err,
    res
  ) {
    if (err) throw err;
    inquirer
      .prompt({
        name: "role",
        type: "list",
        message: "Which role would you like to remove?",
        choices: res
      })
      .then(function(answers) {
        connection.query(
          `DELETE FROM roles WHERE roles.id=${answers.role}`,
          function(err, res) {
            if (err) throw err;
            start();
          }
        );
      });
  });
}

function removeDepartment() {
  connection.query(`SELECT name, id as value FROM departments`, function(
    err,
    res
  ) {
    if (err) throw err;
    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "Which department would you like to remove?",
        choices: res
      })
      .then(function(answers) {
        connection.query(
          `DELETE FROM departments WHERE departments.id=${answers.department}`,
          function(err, res) {
            if (err) throw err;
            start();
          }
        );
      });
  });
}
