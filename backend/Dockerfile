# Stage 1: Build the application
FROM eclipse-temurin:21-jdk-jammy as builder
# Use Eclipse Temurin JDK 21 (on Ubuntu Jammy base) for building the application

WORKDIR /app
# Set the working directory inside the container to /app

COPY . .
# Copy all files from the current host directory into the container's /app directory

RUN ./mvnw clean package -DskipTests
# Use Maven Wrapper to clean and package the application, skipping tests for faster build

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-jammy
# Use a lighter JRE (Java Runtime Environment) version to run the application, reducing image size

WORKDIR /app
# Set the working directory for the runtime container to /app

COPY --from=builder /app/target/*.jar app.jar
# Copy the built JAR file from the builder stage into the current stage

CMD ["java", "-jar", "app.jar"]
# Command to run the application using the JAR file
