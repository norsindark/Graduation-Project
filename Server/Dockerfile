# FROM openjdk:21-jdk-slim

# WORKDIR /app

# COPY target/*.jar app.jar

# EXPOSE 8080

# ENTRYPOINT ["java", "-jar", "app.jar"]



FROM openjdk:21-jdk-slim AS build
WORKDIR /app

COPY . /app

WORKDIR /app/Server

RUN chmod +x mvnw


RUN ./mvnw clean package -DskipTests

FROM openjdk:21-jdk-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]