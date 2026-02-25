const initialEmployees = [
  { id: 1, name: "Carolynn McGinlay" },
  { id: 2, name: "Lodovico Filon" },
  { id: 3, name: "Jefferey Wahlberg" },
  { id: 4, name: "Kayley Tures" },
  { id: 5, name: "Rickard Carver" },
  { id: 6, name: "Michael Stryde" },
  { id: 7, name: "Averell Santino" },
  { id: 8, name: "Constantina Connue" },
  { id: 9, name: "Verile Bondesen" },
  { id: 10, name: "Gwen Grollmann" },
];

const employees = initialEmployees.map((employee) => ({ ...employee }));

export function getAllEmployees() {
  return employees.map((employee) => ({ ...employee }));
}

export function getEmployeeById(employeeId) {
  const foundEmployee = employees.find((employee) => employee.id === employeeId);

  if (!foundEmployee) {
    return null;
  }

  return { ...foundEmployee };
}

export function getRandomEmployee() {
  const randomIndex = Math.floor(Math.random() * employees.length);
  return { ...employees[randomIndex] };
}

export function isValidEmployeeName(employeeName) {
  return typeof employeeName === "string" && employeeName.trim() !== "";
}

function normalizeEmployeeName(employeeName) {
  return employeeName.trim();
}

function getNextEmployeeId() {
  const highestExistingId = employees.reduce((currentHighestId, employee) => {
    return Math.max(currentHighestId, employee.id);
  }, 0);

  return highestExistingId + 1;
}

export function createEmployee(employeeName) {
  const newEmployee = {
    id: getNextEmployeeId(),
    name: normalizeEmployeeName(employeeName),
  };

  employees.push(newEmployee);
  return { ...newEmployee };
}

export function updateEmployeeName(employeeId, employeeName) {
  const foundEmployee = employees.find((employee) => employee.id === employeeId);

  if (!foundEmployee) {
    return null;
  }

  foundEmployee.name = normalizeEmployeeName(employeeName);
  return { ...foundEmployee };
}

export function deleteEmployeeById(employeeId) {
  const foundEmployeeIndex = employees.findIndex(
    (employee) => employee.id === employeeId,
  );

  if (foundEmployeeIndex === -1) {
    return null;
  }

  const deletedEmployees = employees.splice(foundEmployeeIndex, 1);
  return { ...deletedEmployees[0] };
}

export function resetEmployees() {
  employees.length = 0;
  initialEmployees.forEach((employee) => {
    employees.push({ ...employee });
  });
}
