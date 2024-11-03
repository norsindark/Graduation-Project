FROM eclipse-temurin:17-jdk-focal
 
WORKDIR /app
 
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
 
COPY src ./src

# Expose cổng 8080 để truy cập backen
EXPOSE 8080
 
CMD ["./mvnw", "spring-boot:run"]