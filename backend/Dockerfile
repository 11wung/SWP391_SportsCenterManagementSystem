# ==========================================
# DOCKERFILE FOR SPRING BOOT BACKEND
# Multi-stage build for optimal image size
# ==========================================

# Stage 1: Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and pom.xml first for layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x ./mvnw

# Download dependencies offline
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and build jar
COPY src/ ./src/
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy jar from builder stage
COPY --from=builder /app/target/sports-center-backend-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
