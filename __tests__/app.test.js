import request from "supertest";
import { beforeEach, describe, expect, it, test } from "vitest";

import app from "#app";
import { getAllEmployees, resetEmployees } from "#db/employees";

beforeEach(() => {
  resetEmployees();
});

describe("Express app", () => {
  it("is defined", () => {
    expect(app).toBeDefined();
  });

  it("responds to requests", async () => {
    const response = await request(app).get("/");
    expect(response).toBeDefined();
  });
});

test("GET / sends the string 'Hello employees!' with status 200", async () => {
  const response = await request(app).get("/");
  expect(response.status).toBe(200);
  expect(response.text).toBe("Hello employees!");
});

test("GET /employees returns the list of employees with status 200", async () => {
  const response = await request(app).get("/employees");
  const expectedEmployees = getAllEmployees();
  expect(response.status).toBe(200);
  expect(response.body).toEqual(expectedEmployees);
});

describe("GET /employees/:id", () => {
  it("sends employee #1 with status 200", async () => {
    const response = await request(app).get("/employees/1");
    const expected = getAllEmployees().find((employee) => employee.id === 1);
    expect(response.body).toEqual(expected);
  });

  it("sends 404 for non-existent employee", async () => {
    const response = await request(app).get("/employees/999");
    expect(response.status).toBe(404);
  });
});

describe("GET /employees/random", () => {
  it("sends an employee with ID and name", async () => {
    const response = await request(app).get("/employees/random");
    const employee = response.body;
    expect(employee).toHaveProperty("id");
    expect(employee).toHaveProperty("name");
  });

  it("returns more than one unique employee across multiple requests", async () => {
    const employeeIds = new Set();

    for (let requestCount = 0; requestCount < 20; requestCount += 1) {
      const response = await request(app).get("/employees/random");
      employeeIds.add(response.body.id);
    }

    expect(employeeIds.size).toBeGreaterThan(1);
  });
});

describe("POST /employees", () => {
  it("sends 400 if request body is not provided", async (req, res) => {
    const response = await request(app).post("/employees");
    expect(response.status).toBe(400);
  });

  it("sends 400 if name is not provided", async (req, res) => {
    const response = await request(app).post("/employees").send({});
    expect(response.status).toBe(400);
  });

  it("sends 400 if an empty name is provided", async (req, res) => {
    const response = await request(app).post("/employees").send({ name: "" });
    expect(response.status).toBe(400);
  });

  it("sends new employee with status 201 if name is provided", async (req, res) => {
    const name = "Amazing Employee";
    const response = await request(app).post("/employees").send({ name });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body.name).toBe(name);
  });

  it("creates an employee with a unique ID", async (req, res) => {
    await request(app).post("/employees").send({ name: "foo" });
    const ids = new Set();
    const allEmployees = getAllEmployees();
    allEmployees.forEach((employee) => ids.add(employee.id));
    expect(allEmployees.length).toBe(ids.size);
  });
});

describe("PUT /employees/:id", () => {
  it("sends 400 if name is not provided", async () => {
    const response = await request(app).put("/employees/1").send({});
    expect(response.status).toBe(400);
  });

  it("sends 404 if employee does not exist", async () => {
    const response = await request(app)
      .put("/employees/999")
      .send({ name: "New Name" });
    expect(response.status).toBe(404);
  });

  it("updates the employee name and returns the updated employee", async () => {
    const response = await request(app)
      .put("/employees/1")
      .send({ name: "Updated Name" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("name", "Updated Name");
  });
});

describe("DELETE /employees/:id", () => {
  it("sends 404 if employee does not exist", async () => {
    const response = await request(app).delete("/employees/999");
    expect(response.status).toBe(404);
  });

  it("deletes an employee and returns the deleted employee", async () => {
    const createResponse = await request(app)
      .post("/employees")
      .send({ name: "Employee To Delete" });

    const createdEmployeeId = createResponse.body.id;

    const deleteResponse = await request(app).delete(
      `/employees/${createdEmployeeId}`,
    );

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty("id", createdEmployeeId);
    expect(deleteResponse.body).toHaveProperty("name", "Employee To Delete");
  });
});
