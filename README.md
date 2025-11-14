# Full Stack Todo List Application

This is a full-stack Todo List application built with React and Node.js using TypeScript. It supports user authentication, todo management, and password reset functionality.

## Features

- User Signup, Login with JWT authentication
- Forgot Password & Reset Password via email link
- Create, Update, Delete, Mark Todos as completed
- Backend logs errors into MongoDB logs collection
- Frontend uses React Router, Zustand for global state, React Query for API handling, React Hook Form and Zod for form validation
- Responsive UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB Atlas account and cluster
- Gmail account with app password for sending emails (for password reset emails)

### Environment Variables

Create `.env` files in your backend folder with:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=http://localhost:3000
PORT=5000


### Installation

1. Backend

cd backend
npm install
npm run dev



2. Frontend


cd frontend
npm install
npm run dev



Open [http://localhost:3000](http://localhost:3000) in your browser.

## Password Reset Flow

- On the login page, click "Forgot Password?" to enter your registered email.
- You will receive a reset link via email.
- Click the link to open the Reset Password page.
- Enter your new password to update it.

## Assumptions

- Reset password emails are sent using Nodemailer through Gmail with app passwords.
- Environment variables are properly set for email and JWT secrets.
- MongoDB Atlas is used for database and logs.

## Known Issues

- Email delivery may be delayed or go to spam.
- Rate limiting on forgot password requests is not implemented yet.

## License

This project is licensed under the MIT License.


