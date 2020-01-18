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
        { name: "Remove employee", value: "removeEmployee" },
        { name: "Update employee Role", value: "updateEmployeeRole" },
        { name: "Update employee Manager", value: "updateEmployeeManager" }
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
        case "removeEmployee":
          removeEmployee();
          break;
        case "updateEmployeeRole":
          updateEmployeeRole();
          break;
        case "updateEmployeeManager":
          updateEmployeeManager();
          break;
      }
    });
}

function viewEmployees() {
  connection.query(
    "SELECT e.id, e.first_name, e.last_name, roles.title, roles.salary, departments.name as department_name, CONCAT_WS(' ', m.first_name, m.last_name) as manager FROM employees e INNER JOIN roles ON e.role_id=roles.id INNER JOIN departments ON roles.department_id=departments.id LEFT JOIN employees m on e.manager_id=m.id",
    function(err, res) {
      console.log(cTable.getTable(res));
      start();
    }
  );
}

function viewEmployeesByDepartment() {
  connection.query("SELECT * FROM departments", function(err, res) {
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
            console.log(cTable.getTable(res));
            start();
          }
        );
      });
  });
}
