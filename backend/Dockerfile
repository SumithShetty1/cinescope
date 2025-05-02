# Stage 1: Build the application
FROM eclipse-temurin:21-jdk-jammy as builder
# Use Eclipse Temurin JDK 21 (on Ubuntu Jammy base) for building the application

WORKDIR /app
# Set the working directory inside the container to /app

# 1. Copy only the Maven wrapper files
COPY .mvn/ .mvn
COPY mvnw ./
# Copy Maven wrapper directory and script

# 2. Make mvnw executable
RUN chmod +x mvnw
# Fix permission issues on Unix systems

# 3. Copy the pom.xml and download dependencies
COPY pom.xml ./
RUN ./mvnw dependency:go-offline
# Download dependencies to leverage Docker layer caching

# 4. Copy source code
COPY src ./src
# Copy the application source code last for better caching

# Build the application
RUN ./mvnw clean package -DskipTests
# Use Maven Wrapper to build the project without running tests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-jammy
# Use a lighter JRE to reduce final image size

WORKDIR /app
# Set the working directory in the runtime container

COPY --from=builder /app/target/*.jar app.jar
# Copy the built JAR file from the builder image

CMD ["java", "-jar", "app.jar"]
# Run the application
