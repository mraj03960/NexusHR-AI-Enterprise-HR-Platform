FROM eclipse-temurin:23-jdk

WORKDIR /app

COPY backend/employee-service/target/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]
