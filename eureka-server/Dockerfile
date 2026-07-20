FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy only the real boot jar (NOT the *.jar.original)
COPY target/eureka-server-1.0.0.jar /app/app.jar

EXPOSE 8761

ENTRYPOINT ["java","-jar","/app/app.jar"]
