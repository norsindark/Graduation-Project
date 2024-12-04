# FROM openjdk:21-jdk-slim

# WORKDIR /app

# COPY target/*.jar app.jar

# EXPOSE 8080

# ENTRYPOINT ["java", "-jar", "app.jar"]



# FROM openjdk:21-jdk-slim AS build
# WORKDIR /app

# COPY . /app

# WORKDIR /app/Server

# RUN chmod +x mvnw

# RUN ./mvnw clean package -DskipTests

# FROM openjdk:21-jdk-slim

# WORKDIR /app

# COPY target/*.jar app.jar

# EXPOSE 8080

# ENTRYPOINT ["java", "-jar", "app.jar"]

FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app/Server
COPY . .
RUN chmod +x mvnw && mvn clean package -DskipTests

FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /app/Server/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
