import express from "express";
import {
  createEmployee,
  deleteEmployeeById,
  getAllEmployees,
  getEmployeeById,
  getRandomEmployee,
  isValidEmployeeName,
  updateEmployeeName,
} from "#db/employees";

const employeesRouter = express.Router();

employeesRouter.get("/", (request, response) => {
  const allEmployees = getAllEmployees();
  response.json(allEmployees);
});

employeesRouter.get("/random", (request, response) => {
  const randomEmployee = getRandomEmployee();
  response.json(randomEmployee);
});

employeesRouter.get("/:id", (request, response) => {
  const employeeId = Number(request.params.id);
  const foundEmployee = getEmployeeById(employeeId);

  if (foundEmployee) {
    response.json(foundEmployee);
  } else {
    response.status(404).send("Employee not found.");
  }
});

employeesRouter.post("/", (request, response) => {
  const providedName = request.body?.name;

  if (!isValidEmployeeName(providedName)) {
    return response.status(400).send("Name is required.");
  }

  const newEmployee = createEmployee(providedName);
  response.status(201).json(newEmployee);
});

employeesRouter.put("/:id", (request, response) => {
  const employeeId = Number(request.params.id);
  const providedName = request.body?.name;

  if (!isValidEmployeeName(providedName)) {
    return response.status(400).send("A valid name is required.");
  }

  const updatedEmployee = updateEmployeeName(employeeId, providedName);

  if (!updatedEmployee) {
    return response.status(404).send("Employee not found.");
  }

  response.json(updatedEmployee);
});

employeesRouter.delete("/:id", (request, response) => {
  const employeeId = Number(request.params.id);
  const deletedEmployee = deleteEmployeeById(employeeId);
  if (!deletedEmployee) {
    return response.status(404).send("Employee not found.");
  }

  response.json(deletedEmployee);
});

export default employeesRouter;
