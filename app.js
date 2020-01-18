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
        { name: "Update employee Role", value: "updateEmployeeRole" },
        { name: "Update employee Manager", value: "updateEmployeeManager" },
        { name: "Exit", value: "exit" }
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "viewEmployees":
          viewEmployees();
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
        case "updateEmployeeRole":
          updateEmployeeRole();
          break;
        case "updateEmployeeManager":
          updateEmployeeManager();
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
