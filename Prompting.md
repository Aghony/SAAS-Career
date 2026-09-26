Saya ingin membangun sebuah **Career Management SaaS** yang awalnya digunakan untuk kebutuhan pribadi, tetapi arsitekturnya harus memungkinkan untuk dikembangkan menjadi SaaS multi-user di masa depan.

## Tujuan Produk

Aplikasi ini berfungsi sebagai **Personal Career Management System** untuk membantu pengguna mengelola perjalanan karier secara terstruktur.

Fokus utama MVP adalah:

1. Job application tracking
2. Career dashboard
3. Resume management
4. Project/portfolio management
5. Skill tracking
6. Interview tracking
7. Career analytics

Jangan langsung membuat semua fitur sekaligus. Bangun sistem secara bertahap dengan fondasi yang rapi dan mudah dikembangkan.

## Tech Stack

Gunakan:

### Frontend

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS

### Backend

* Node.js
* TypeScript
* Express.js
* REST API

### Database

* PostgreSQL
* Prisma ORM

### Authentication

* Email + password
* Password hashing
* JWT atau secure session
* Protected routes

### Development

* Git
* Docker
* ESLint
* Prettier

## Prinsip Pengembangan

Saya ingin memahami dan membangun sistem ini dari fundamental.

Jangan menggunakan pendekatan "vibe coding".

Untuk setiap bagian yang dibuat:

1. Jelaskan tujuan bagian tersebut.
2. Jelaskan struktur folder.
3. Jelaskan alasan pemilihan teknologi.
4. Jelaskan database schema.
5. Jelaskan API endpoint.
6. Jelaskan alur data.
7. Berikan kode secara bertahap.
8. Jelaskan kode yang dibuat.
9. Berikan cara menjalankan dan menguji fitur tersebut.
10. Jangan membuat kode yang belum diperlukan.

Jangan membuat seluruh aplikasi sekaligus.

Prioritaskan:

* clean architecture
* separation of concerns
* maintainability
* security
* validation
* error handling
* scalability

## Arsitektur

Gunakan pemisahan:

Frontend:

* pages
* components
* layouts
* hooks
* services
* types

Backend:

src/
├── config/
├── controllers/
├── middlewares/
├── routes/
├── services/
├── repositories/
├── validators/
├── utils/
├── types/
└── app.ts

Pisahkan business logic dari controller.

Controller hanya menangani request/response.

Service menangani business logic.

Repository menangani interaksi database.

## MVP V1

Mulai hanya dengan:

### Authentication

User dapat:

* register
* login
* logout
* melihat profile

User memiliki:

* id
* name
* email
* passwordHash
* createdAt
* updatedAt

### Job Applications

User dapat membuat application dengan:

* company
* position
* jobUrl
* location
* employmentType
* salaryMin
* salaryMax
* appliedAt
* deadline
* status
* notes
* createdAt
* updatedAt

Status:

* wishlist
* applied
* assessment
* interview
* technical_test
* offer
* rejected
* withdrawn

Setiap application harus dimiliki oleh user tertentu.

User tidak boleh dapat mengakses application milik user lain.

## Dashboard

Dashboard menampilkan:

* total applications
* applications berdasarkan status
* upcoming deadlines
* upcoming interviews
* recent applications

Contoh:

Applications: 24
Interviews: 7
Technical Tests: 5
Offers: 2

Gunakan data database sebenarnya, bukan hardcoded data.

## UI

Buat interface yang:

* modern
* minimal
* professional
* responsive
* mudah digunakan
* cocok untuk career management

Layout:

Sidebar:

* Dashboard
* Applications
* Resume
* Projects
* Skills
* Interviews
* Analytics
* Settings

Untuk MVP, halaman yang aktif terlebih dahulu:

Dashboard
Applications
Settings

Halaman lainnya boleh berupa placeholder.

## Job Application UI

Gunakan layout Kanban untuk status application:

Wishlist
Applied
Assessment
Interview
Technical Test
Offer
Rejected

Selain Kanban, sediakan list/table view.

User dapat:

* create application
* edit application
* delete application
* melihat detail application
* mengubah status

## Database

Buat relational database yang normal dan memiliki foreign key yang jelas.

Minimal model:

User
Application

Siapkan desain agar nantinya mudah ditambahkan:

Resume
Project
Skill
Interview
CareerEvent

Gunakan UUID atau ID yang aman sebagai primary key.

Tambahkan:

* timestamps
* indexes yang relevan
* unique constraints jika diperlukan
* foreign keys
* cascade behavior yang aman

## API

Gunakan REST API.

Contoh:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

GET /api/applications
GET /api/applications/:id
POST /api/applications
PATCH /api/applications/:id
DELETE /api/applications/:id

GET /api/dashboard

Semua endpoint yang membutuhkan authentication harus menggunakan authentication middleware.

Validasi request menggunakan schema validation.

Berikan HTTP status code yang benar dan response format yang konsisten.

Contoh:

{
"success": true,
"data": {}
}

Untuk error:

{
"success": false,
"error": {
"code": "VALIDATION_ERROR",
"message": "Invalid request"
}
}

## Security

Perhatikan:

* password hashing
* authentication
* authorization
* input validation
* SQL injection prevention
* CORS
* rate limiting
* secure cookies jika menggunakan session
* environment variables
* jangan menyimpan secret di repository

Gunakan `.env` dan sediakan `.env.example`.

## Testing

Setelah setiap fitur selesai, buat testing yang relevan.

Minimal:

Backend:

* authentication test
* application CRUD test
* authorization test
* validation test

Pastikan user A tidak dapat membaca atau mengubah application milik user B.

## Docker

Siapkan Docker Compose untuk:

* PostgreSQL
* Backend
* Frontend jika diperlukan

Development environment harus dapat dijalankan dengan mudah.

## Development Roadmap

Ikuti urutan:

Phase 1
Project setup

Phase 2
Database + Prisma

Phase 3
Authentication

Phase 4
Application CRUD

Phase 5
Dashboard

Phase 6
Frontend integration

Phase 7
Testing

Phase 8
Docker

Phase 9
Resume management

Phase 10
Project/portfolio management

Phase 11
Skill tracking

Phase 12
Interview tracking

Phase 13
Career analytics

Phase 14
AI Career Assistant

## AI Feature — Future

Jangan implementasikan AI pada MVP.

Pada tahap selanjutnya, AI dapat digunakan untuk:

* menganalisis job description
* mengidentifikasi skill yang dibutuhkan
* membandingkan skill user dengan job requirement
* membantu memperbaiki resume
* menghasilkan interview questions
* membuat interview preparation plan
* memberikan feedback terhadap jawaban interview

AI harus menjadi fitur tambahan, bukan fondasi utama aplikasi.

## Cara Kerja yang Saya Inginkan

Jangan langsung memberikan seluruh source code.

Mulai dari:

1. Analisis requirement
2. Tentukan MVP
3. Buat architecture
4. Buat folder structure
5. Setup project
6. Setup PostgreSQL
7. Setup Prisma
8. Buat User model
9. Migration
10. Baru lanjut authentication

Setelah setiap tahap, jelaskan apa yang terjadi dan bagaimana saya dapat menjalankan serta menguji hasilnya.

Jika terdapat beberapa pilihan implementasi, jelaskan trade-off-nya terlebih dahulu dan pilih satu pendekatan yang paling sesuai untuk project ini.

Prioritaskan pembelajaran, kualitas arsitektur, dan pemahaman saya terhadap kode daripada menghasilkan kode sebanyak mungkin.
