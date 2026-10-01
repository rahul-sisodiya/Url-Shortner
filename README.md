# URL Shortner

A full-stack URL shortening service — a React (Vite) frontend paired with a Spring Boot REST API backed by MySQL.

---

## Architecture

| Layer       | Technology          | Location         |
|-------------|---------------------|------------------|
| Frontend    | React 19 + Vite     | `my-app/`        |
| Backend     | Spring Boot 4.1.1   | `shortly/`       |
| Database    | MySQL 8+            | External         |

- **Frontend** (`my-app`) — single-page React app served as static files (Vite build → `dist/`).
- **Backend** (`shortly`) — Spring Boot REST API that shortens URLs (Base62-encoded primary-key IDs), redirects, and tracks click counts.
- **Communication** — Frontend calls the backend's `/shorten` endpoint via `fetch` + environment-configured API URL.

---

## Prerequisites

**Java 25+** — required by the Spring Boot backend.
**Node.js 20+** — required for the frontend build/dev.
**MySQL 8+** — the backend database.

---

## Local Development

### 1. Set up the database

Create the database in MySQL:

```sql
CREATE DATABASE url_shortner CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend — `shortly/`

Create the environment file (not committed — see `.gitignore`):

```bash
# shortly/shortly/src/.env
DB_URL=jdbc:mysql://localhost:3306/url_shortner
DB_USERNAME=<your-mysql-username>
DB_PASSWORD=<your-mysql-password>
FRONTEND_URL=http://localhost:5173
```

Run:

```bash
cd shortly/shortly
./mvnw spring-boot:run
```

The backend API will be available at `http://localhost:8080`.

> **Note:** The MySQL username/password do **not** need to be `springstudent`. Any valid MySQL credentials with access to the `url_shortner` database work. Spring Data JPA manages table creation when you opt in to schema generation (uncomment `spring.jpa.hibernate.ddl-auto=create-drop` in `application.properties` for the first run).

### 3. Frontend — `my-app/`

Create the environment file (not committed):

```bash
# my-app/src/.env
VITE_API_URL=http://localhost:8080
```

Run the dev server:

```bash
cd my-app
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Production Build & Deployment

The recommended production setup serves **both** frontend and backend from a single Spring Boot JAR. Follow the steps below.

---

### Step 1 — Build the Frontend

From the `my-app/` directory:

```bash
cd my-app
npm install
npm run build
```

This produces the static output in `my-app/dist/`.

### Step 2 — Bundle the Frontend into the Backend

Copy the built static assets so Spring Boot serves them at `/`:

```bash
cp -r my-app/dist/* shortly/shortly/src/main/resources/static/
```

> On Windows use: `xcopy my-app\dist\* shortly\shortly\src\main\resources\static\ /E /I /Y`

### Step 3 — Configure the Backend

Create the production env file (or set environment variables on your server):

```bash
# shortly/shortly/src/.env
DB_URL=jdbc:mysql://<db-host>:3306/url_shortner
DB_USERNAME=<your-mysql-username>
DB_PASSWORD=<your-mysql-password>
FRONTEND_URL=https://your-domain.com        # used for CORS
```

If you're serving both frontend + backend from the same origin, set `FRONTEND_URL` to the site's own origin.

> If the `static/` folder was added after `./mvnw`, clean first: `./mvnw clean package`.

### Step 4 — Build the Backend JAR

From the `shortly/shortly/` directory:

```bash
cd shortly/shortly
./mvnw clean package
```

This produces the executable JAR:

```
shortly/shortly/target/shortly-0.0.1-SNAPSHOT.jar
```

### Step 5 — Run

```bash
cd shortly/shortly
java -jar target/shortly-0.0.1-SNAPSHOT.jar
```

Set the env vars before launching:

```bash
export DB_URL="jdbc:mysql://<db-host>:3306/url_shortner"
export DB_USERNAME="<your-mysql-username>"
export DB_PASSWORD="<your-mysql-password>"
export FRONTEND_URL="https://your-domain.com"
java -jar target/shortly-0.0.1-SNAPSHOT.jar
```

The application will be available at `http://localhost:8080` (or your server's public address).

---

## API

All endpoints are relative to the backend root (`http://localhost:8080`).

| Method | Endpoint        | Description                          |
|--------|-----------------|--------------------------------------|
| POST   | `/shorten`      | Shorten a URL                       |
| GET    | `/{shortUrl}`   | Redirect to the original URL        |

**POST `/shorten`**

```bash
curl -X POST http://localhost:8080/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/very/long/url"}'
```

Response:

```json
{
  "id": 1,
  "url": "https://example.com/very/long/url",
  "shortUrl": "b",
  "createdOn": "2025-01-15T10:30:00",
  "lastAccessed": "2025-01-15T10:30:00",
  "clickCount": 0
}
```

The short link is `http://localhost:8080/b`.

---

## Environment Variables

### Frontend (`my-app/src/.env`)

| Variable        | Description                                  |
|-----------------|----------------------------------------------|
| `VITE_API_URL`  | Backend base URL (e.g. `http://localhost:8080`) |

### Backend (`shortly/shortly/src/.env`)

| Variable      | Description                                |
|---------------|--------------------------------------------|
| `DB_URL`      | JDBC URL for MySQL                         |
| `DB_USERNAME` | MySQL username                             |
| `DB_PASSWORD` | MySQL password                             |
| `FRONTEND_URL`| Allowed frontend origin(s) for CORS. Comma-separated for multiple origins. |

---

## Project Layout

```
url-shortner/
├── README.md
├── my-app/                              # Frontend (React + Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── UrlShortner.jsx
│   │   │   └── UrlShortner.css
│   │   ├── assets/
│   │   ├── .env                         # (git-ignored) VITE_API_URL
│   │   └── .gitignore
│   └── .gitignore
└── shortly/
    └── shortly/                         # Backend (Spring Boot)
        ├── pom.xml
        ├── mvnw / mvnw.cmd              # Maven wrapper
        ├── .mvn/
        ├── src/
        │   ├── main/
        │   │   ├── java/com/coldcoffee/shortly/
        │   │   │   ├── ShortlyApplication.java
        │   │   │   ├── config/CorsConfig.java
        │   │   │   ├── controller/UrlController.java
        │   │   │   ├── service/UrlService.java
        │   │   │   ├── repository/UrlRepository.java
        │   │   │   ├── entity/Url.java
        │   │   │   └── dto/ShortUrlRequestDto.java
        │   │   ├── resources/
        │   │   │   ├── application.properties
        │   │   │   ├── static/           # (add frontend build output here)
        │   │   │   └── .env              # (git-ignored) DB + CORS config
        │   └── test/...
        └── .gitignore
```

---

## Troubleshooting

**`POST http://localhost:5173/undefined/shorten 404`** — the `VITE_API_URL` env var is not loaded. Ensure `.env` exists at `my-app/src/.env` and contains `VITE_API_URL=http://localhost:8080`. Restart the dev server after creating it.

**CORS errors** — verify `FRONTEND_URL` is set to your frontend's actual origin (domain + port). Multiple origins can be comma-separated.

**Database connection refused** — confirm MySQL is running and the credentials in `shortly/shortly/src/.env` are valid.

---

## License

This project is provided as-is for educational/portfolio use.
