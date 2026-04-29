# URL Shortener

A minimalist full-stack URL shortener with click tracking — built end-to-end in a single day to demonstrate clean architecture across Java, Spring Boot, and Angular.

## Live Demo

- **Web app:** _(will be added after deployment)_
- **API:** _(will be added after deployment)_

## Stack

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| Backend  | Java 17 · Spring Boot 4 · Spring Data JPA · Hibernate   |
| Database | PostgreSQL (production) · H2 in-memory (development)    |
| Frontend | Angular 21 (standalone, zoneless, signals)              |
| Styling  | Tailwind CSS v4                                         |
| Hosting  | Render (free tier)                                      |

## Features

- Generate short URLs using Base62 encoding of auto-incrementing database IDs (collision-free, no random retries)
- Public redirect endpoint with per-link click counter
- Stats lookup endpoint exposing click count and creation timestamp
- Reactive form validation with inline error messages
- Copy-to-clipboard with feedback state
- Configurable CORS for safe cross-origin deployment
- Environment-based API URL switching (dev vs production)

## API Reference

| Method | Endpoint                  | Description                                           |
| ------ | ------------------------- | ----------------------------------------------------- |
| `POST` | `/api/shorten`            | Create a short link from a long URL                   |
| `GET`  | `/{shortCode}`            | Redirect to the original URL and increment its counter |
| `GET`  | `/api/stats/{shortCode}`  | Return click count and metadata for a short code      |

### Example

```bash
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'
```

```json
{
  "shortCode": "1",
  "shortUrl": "http://localhost:8080/1",
  "longUrl": "https://github.com"
}
```

## Architecture Notes

- **Base62 encoding** turns each row's primary key into a short, unique code (`1` → `"1"`, `100000` → `"q0U"`). Eliminates the need for collision-checking loops or pre-allocated key pools.
- **Two-phase save** in `UrlShortenerService`: insert the row to obtain the auto-generated ID, then update the row with the encoded short code. Trades one extra `UPDATE` for guaranteed correctness with `IDENTITY` ID generation.
- **Profile-based config** in `application.yml`: H2 in-memory for local development, PostgreSQL for production via Spring profiles.
- **Zoneless change detection** on the frontend uses Angular Signals for state — no Zone.js polyfill, smaller bundle, faster runtime.

## Run Locally

### Prerequisites

- JDK 17+
- Node.js 20+
- Maven (or use the included `./mvnw` wrapper)

### Backend

```bash
cd urlshortener
./mvnw spring-boot:run
```

API available at `http://localhost:8080`.

### Frontend

```bash
cd url-shortener-frontend
npm install
ng serve
```

App available at `http://localhost:4200`.

## Project Structure

```
url-shortener/
├── urlshortener/                  Spring Boot backend
│   ├── src/main/java/com/hamzazine/urlshortener/
│   │   ├── controller/            REST endpoints
│   │   ├── service/               Business logic and Base62 encoder
│   │   ├── entity/                JPA entities
│   │   ├── repository/            Spring Data repositories
│   │   ├── dto/                   Request/response records
│   │   ├── exception/             Domain errors and global handler
│   │   └── config/                CORS configuration
│   └── src/main/resources/application.yml
└── url-shortener-frontend/        Angular frontend
    └── src/app/
        ├── components/shortener/  URL submission + result display
        ├── components/stats/      Click stats lookup
        └── services/              API client
```

## Possible Improvements

- Custom alias support (let users choose their own short code)
- Link expiration timestamps
- Click analytics chart (clicks over time)
- Rate limiting per IP at the redirect endpoint
- QR code generation for each short link
- API key authentication for the shorten endpoint

## Author

Built by [Hamza Zine](https://github.com/HamZa2108).
