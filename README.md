# Server

### Setting apache and jdk
1. **Download this folder**:
   ```bash
     https://drive.google.com/file/d/1mRmpALO5WBx_CeTnslZdllfW0egKsmva/view?usp=drive_link
   ```
2. **Set JAVA_HOME and MAVEN_HOME**:
   
   follow the instructions below:

   JAVA_HOME
   
   ```bash
     https://mkyong.com/java/how-to-set-java_home-on-windows-10/
   ```
   MAVEN_HOME
   ```bash
     [https://mkyong.com/java/how-to-set-java_home-on-windows-10/](https://mkyong.com/maven/how-to-install-maven-in-windows/)
   ```
### Swagger API Documentation

This project includes a Swagger UI for easy visualization and interaction with the API. Swagger UI provides a user-friendly interface to explore the available endpoints, view request and response formats, and test the API directly from your browser.

#### Running the Server

1. **Ensure the application is running**:
   - Make sure you have built and started your application. If you're running a Spring Boot application, you can start the application using the following command:

     ```bash
     ./mvnw spring-boot:run
     ```

#### Accessing Swagger UI

2. **Access Swagger UI**:
   - Once the application is up and running, open your browser and go to the following URL:

     ```
     http://localhost:8080/swagger-ui.html
     ```

   - This will bring up the Swagger UI interface, where you can explore all the available API endpoints.

### Additional Configuration

Swagger is automatically configured in this project. However, if you need to customize the configuration, you can do so in the `application.yml` or `application.properties` file, depending on your setup.

### Troubleshooting

- If you encounter a 404 error when accessing `http://localhost:8080/swagger-ui.html`, ensure that the `springdoc-openapi-ui` dependency is included in your `pom.xml` or `build.gradle` file.

- If the application is not running on port 8080, replace `8080` in the URL with the correct port number.
