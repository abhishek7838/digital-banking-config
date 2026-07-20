FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the Spring Boot fat jar (built by spring-boot-maven-plugin)
COPY target/*.jar app.jar

EXPOSE 8087

ENTRYPOINT ["java","-jar","/app/app.jar"]