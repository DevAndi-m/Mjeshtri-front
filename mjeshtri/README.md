# Mjeshtri - Expert Marketplace Platform

A full-stack web application connecting clients with experts for various services. Built with React frontend and C# .NET backend.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Mjeshtri is a comprehensive marketplace platform that connects clients with verified experts across various service categories. The platform supports user registration, expert profiles, booking management, and administrative controls.

### Project Structure

```
Mjeshtri/
├── Mjeshtri-front/          # React Frontend
│   └── mjeshtri/
│       ├── src/
│       │   ├── Components/   # Reusable UI components
│       │   ├── pages/        # Page components
│       │   ├── context/      # React context providers
│       │   └── assets/       # Static assets
│       ├── package.json
│       └── vite.config.js
└── Mjeshtri-Back/           # C# .NET Backend
    └── MjeshtriAPI/
        ├── Controllers/      # API controllers
        ├── Models/           # Entity models & DTOs
        ├── Data/             # Database context
        └── Migrations/       # EF migrations
```

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Context** - State management

### Backend

- **C# .NET 10** - Runtime framework
- **ASP.NET Core** - Web API framework
- **Entity Framework Core** - ORM
- **SQL Server** - Database
- **JWT** - Authentication
- **BCrypt** - Password hashing

### Development Tools

- **Visual Studio Code** - IDE
- **Git** - Version control
- **npm** - Package management
- **dotnet CLI** - .NET development

## ✨ Features

### User Management

- User registration and authentication
- JWT-based secure login
- Role-based access control (User, Expert, Admin)
- Profile management with bio and profile pictures

### Expert Marketplace

- Expert profile creation with categories and hourly rates
- Service requirements specification
- Rating and review system
- Public expert listings

### Booking System

- Client-expert booking requests
- Booking status management (Pending, Accepted, Finished, Canceled)
- Review submission after service completion
- Booking history and management

### Admin Panel

- User management (view, edit, delete users)
- Role assignment and modification
- Expert profile management
- System monitoring and oversight

### Security

- Password hashing with BCrypt
- JWT token authentication
- Role-based API access control
- Input validation and sanitization

## 📋 Prerequisites

### System Requirements

- **Node.js** 18+ and npm
- **.NET 10 SDK**
- **SQL Server Express** (or full SQL Server)
- **Git**

### Database Setup

- SQL Server instance running
- Database name: `Lab1Databaza` (configurable in `appsettings.json`)

## 🚀 Installation & Setup

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd Mjeshtri-Back/MjeshtriAPI
   ```

2. **Restore dependencies:**

   ```bash
   dotnet restore
   ```

3. **Apply database migrations:**

   ```bash
   dotnet ef database update
   ```

4. **Run the API server:**

   ```bash
   dotnet run
   ```

   The API will be available at `https://localhost:5000` or `http://localhost:5001`.

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd Mjeshtri-front/mjeshtri
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**
   Create `.env.local` in the frontend root:

   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. **Start development server:**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

### Production Build

```bash
# Frontend production build
npm run build
npm run preview

# Backend production (if needed)
dotnet publish -c Release
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "isExpert": false
}
```

**Response:**

```json
{
  "message": "Registration successful!"
}
```

#### POST `/api/auth/login`

Authenticate user and return JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "jwt_token_here",
  "role": "User",
  "fullName": "John Doe"
}
```

### User Management Endpoints

#### GET `/api/user/me`

Get current user profile (authenticated).

**Response:**

```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "User",
  "bio": "Professional description",
  "profilePictureUrl": "https://...",
  "category": "",
  "hourlyFee": 0,
  "requirements": "",
  "averageRating": 0.0,
  "jobsTaken": 0
}
```

#### PUT `/api/user/me`

Update current user profile (authenticated).

**Request Body:**

```json
{
  "fullName": "John Doe Updated",
  "bio": "Updated bio",
  "profilePictureUrl": "https://...",
  "category": "Plumbing",
  "hourlyFee": 50.0,
  "requirements": "Licensed plumber with 5+ years experience"
}
```

#### POST `/api/user/change-password`

Change user password (authenticated).

**Request Body:**

```json
{
  "password": "newpassword123"
}
```

#### GET `/api/user/all` (Admin only)

Get all users (admin access required).

#### PUT `/api/user/{id}` (Admin only)

Update any user (admin access required).

#### DELETE `/api/user/{id}` (Admin only)

Delete user (admin access required).

### Booking Endpoints

#### GET `/api/booking/my-bookings`

Get current user's bookings (authenticated).

#### POST `/api/booking`

Create new booking (authenticated).

#### PATCH `/api/booking/{id}/status`

Update booking status (authenticated).

#### DELETE `/api/booking/{id}`

Cancel booking (authenticated).

#### PATCH `/api/booking/review`

Submit review for completed booking (authenticated).

### Expert Endpoints

#### GET `/api/expert`

Get all public experts.

#### GET `/api/expert/{id}`

Get expert details by ID.

#### GET `/api/expert/search`

Search experts by category and location.

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Role NVARCHAR(50) NOT NULL DEFAULT 'User',
    ProfilePictureUrl NVARCHAR(MAX) DEFAULT '...',
    Bio NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);
```

### Experts Table

```sql
CREATE TABLE Experts (
    Id INT PRIMARY KEY IDENTITY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
    Category NVARCHAR(100) NOT NULL DEFAULT '',
    HourlyFee DECIMAL(10,2) DEFAULT 0,
    Bio NVARCHAR(MAX) DEFAULT '',
    JobsTaken INT DEFAULT 0,
    AverageRating FLOAT DEFAULT 0.0,
    IsPublic BIT DEFAULT 1,
    Requirements NVARCHAR(MAX) DEFAULT ''
);
```

### Bookings Table

```sql
CREATE TABLE Bookings (
    Id INT PRIMARY KEY IDENTITY,
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
    ExpertId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
    Status NVARCHAR(50) DEFAULT 'Pending',
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    Rating INT,
    ReviewComment NVARCHAR(MAX)
);
```

## 📖 Usage

### For Users

1. Register an account or login
2. Browse experts in the marketplace
3. View expert profiles and ratings
4. Book services with preferred experts
5. Manage bookings and leave reviews

### For Experts

1. Register as expert during signup
2. Complete profile with category, rates, and requirements
3. Receive booking requests from clients
4. Manage booking statuses
5. Build reputation through reviews

### For Admins

1. Access admin panel via header link (admin role required)
2. View all users in the system
3. Edit user details and roles
4. Delete users if necessary
5. Monitor platform activity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and naming conventions
- Write clear, concise commit messages
- Test changes thoroughly before submitting
- Update documentation as needed
- Ensure both frontend and backend builds pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support or questions:

- Create an issue in the repository
- Contact the development team
- Check the API documentation for endpoint details

---

**Built with ❤️ using React, .NET, and modern web technologies.**
