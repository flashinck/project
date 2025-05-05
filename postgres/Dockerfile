FROM postgres:13
COPY init.sql /docker-entrypoint-initdb.d/
ENV POSTGRES_DB=project_management
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=password
