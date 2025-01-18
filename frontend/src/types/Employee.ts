export interface Employee {
    id: number; // Assuming 'id' is the primary key from Users
    employeeID: number;
    username: string;
    email: string;
    role: string;
    loginTimeStamp: string; // ISO date string
  }