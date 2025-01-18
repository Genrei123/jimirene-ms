Sure, here is a documentation draft for your backend project that you can include in your `README.md` file:

# Spring Boot JWT Authentication Backend

## Overview

This project is a Spring Boot application that provides JWT-based authentication. It includes user registration and login functionalities.

## Technologies Used

- Java
- Spring Boot
- Spring Security
- Maven
- JPA (Jakarta Persistence API)

## Project Structure

- `com.jwt.spring_security.config`: Contains configuration classes, including the JWT filter.
- `com.jwt.spring_security.controller`: Contains REST controllers for handling HTTP requests.
- `com.jwt.spring_security.model`: Contains entity classes representing the database tables.
- `com.jwt.spring_security.repo`: Contains repository interfaces for database operations.
- `com.jwt.spring_security.service`: Contains service classes for business logic.

## Endpoints

### Register User

- **URL**: `/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "integer",
    "username": "string",
    "password": "string"
  }
  ```

### Login User

- **URL**: `/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "user": {
      "id": "integer",
      "username": "string",
      "password": "string"
    },
    "token": "string"
  }
  ```

## Classes

### `JwtFilter.java`

This class extends `OncePerRequestFilter` and is responsible for filtering incoming requests to check for a valid JWT token.

### `Users.java`

This class is an entity representing the `Users` table in the database.

### `UserResponse.java`

This class is used to structure the response for the login endpoint, containing the user details and the JWT token.

### `UsersController.java`

This class is a REST controller that handles user registration and login requests.

## How to Run

1. **Clone the repository**:
   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Build the project**:
   ```sh
   mvn clean install
   ```

3. **Run the application**:
   ```sh
   mvn spring-boot:run
   ```

4. **Access the application**:
   The application will be running at `http://localhost:8080`.

## Dependencies

Ensure you have the following dependencies in your `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>jakarta.persistence</groupId>
        <artifactId>jakarta.persistence-api</artifactId>
    </dependency>
</dependencies>
```

## License

This project is licensed under the MIT License.

---
