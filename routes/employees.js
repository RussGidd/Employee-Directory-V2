import express from "express";
import employees from "#db/employees";

const employeesRouter = express.Router();

employeesRouter.get("/", (request, response) => {
  response.json(employees);
});

employeesRouter.get("/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * employees.length);
  const randomEmployee = employees[randomIndex];
  res.json(randomEmployee);
});

employeesRouter.get("/:id", (req, res) => {
  const employeeId = Number(req.params.id);

  const foundEmployee = employees.find((singleEmployee) => {
    return singleEmployee.id === employeeId;
  });

  if (foundEmployee) {
    res.json(foundEmployee);
  } else {
    res.status(404).send("Employee not found.");
  }
});

employeesRouter.post("/", (request, response) => {
  const providedName = request.body?.name;

  if (typeof providedName !== "string" || providedName.trim() === "") {
    return response.status(400).send("Name is required.");
  }

  const newEmployeeId = employees.length + 1;

  const newEmployee = {
    id: newEmployeeId,
    name: providedName,
  };

  employees.push(newEmployee);

  response.status(201).json(newEmployee);
});

export default employeesRouter;
