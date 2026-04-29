\# URL Shortener



A full-stack URL shortening service built with Spring Boot and Angular.



\## Live demo

\- Frontend: TBD (will fill in after deploy)

\- Backend API: TBD



\## Stack

\- \*\*Backend:\*\* Java 17, Spring Boot 4, JPA/Hibernate, PostgreSQL (H2 in dev)

\- \*\*Frontend:\*\* Angular 21 (zoneless + signals), Tailwind CSS v4

\- \*\*Hosting:\*\* Render (free tier)



\## Features

\- Generate short URLs using Base62 encoding of database IDs

\- Public redirect endpoint with click tracking

\- Stats lookup per short code

\- Form validation, error handling, copy-to-clipboard



\## Run locally



\### Backend

```bash

cd urlshortener

./mvnw spring-boot:run



\### Frontend

cd url-shortener-frontend

npm install

ng serve



\### App at http://localhost:4200, API at http://localhost:8080.



\### Initialize git and push

```powershell

cd url-shortener

git init

git branch -M main

git add .

git commit -m "Initial commit: full-stack URL shortener"

