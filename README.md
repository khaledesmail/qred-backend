# Qred Mobile App Backend Case Study

## Assignment Overview

This project is a backend implementation for the Qred mobile app view, as described in the case study. The goal is to deliver a robust, scalable API that enables frontend and backend teams to work in parallel, with a focus on collaboration, transparency, and best practices.

### Task : Backend Implementation
- Design and implement a Node.js backend for the mobile app view.
- Provide a clear database schema and optimized API payloads.
- Ensure the API is ready for frontend consumption and easy to extend.

## Project Structure
- `src/routes/` - API route definitions
- `src/controllers/` - Request controllers
- `src/services/` - Business logic and database access
- `src/models/` - Sequelize ORM models (used for database operations)
- `src/config/` - Database configuration


## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure your environment variables in a `.env` file:
   ```env
   PGHOST=localhost
   PGUSER=your_db_user
   PGPASSWORD=your_db_password
   PGDATABASE=your_db_name
   PGPORT=5432
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `GET /api/mobile-view/company-card` — Returns company and card info for the user.
- `GET /api/mobile-view/credit` — Returns available credit and invoice status for the user.
- `GET /api/mobile-view/transactions?page=1&limit=10` — Returns paginated transaction data, sorted by creation date (use `limit=3` for dashboard preview of latest transactions). The response includes a `remainingCount` field for the number of transactions left after the current page.

### Example response for /transactions
```json
{
  "transactions": [ ... ],
  "total": 57,
  "page": 1,
  "limit": 3,
  "hasMore": true,
  "remainingCount": 54
}
```

## Database Schema
- `users(id, name, company)`
- `cards(id, user_id, image, activated, spend_limit)`
- `transactions(id, user_id, data, points, created_at, amount)`

## Further Improvements
- Add authentication and user context
- Expand transaction filtering and sorting
- Integrate with real payment and invoice systems
- Add automated tests and CI/CD

---

For more details, see the case study PDF and the codebase.
