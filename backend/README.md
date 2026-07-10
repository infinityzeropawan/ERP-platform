# Buildroonix Education ERP Backend API Service

This is the backend API engine for the **Buildroonix Multi-Tenant Education ERP & LMS**.

---

## 🛠️ Stack & Architecture
- **Language**: TypeScript / Node.js
- **API Framework**: Express.js
- **Database Access**: Prisma ORM
- **Target Relational Database**: PostgreSQL

---

## ⚙️ Setting Up Locally

### 1. Install Dependencies
Navigate into the backend directory and run:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the `backend/` folder:
```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5405/buildroonix_erp?schema=public"
```

### 3. Generate Database Client (Prisma)
Create schemas and map types locally:
```bash
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```
The server will boot at `http://localhost:5000`.

---

## 🗃️ DB Migration Instructions
To push schema changes to PostgreSQL:
```bash
npx prisma migrate dev --name init
```
This automatically maps models to Postgres tables.
