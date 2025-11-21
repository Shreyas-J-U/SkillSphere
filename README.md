# 🌟 SkillSphere - Peer-to-Peer Skill Bartering Platform

![SkillSphere](https://img.shields.io/badge/SkillSphere-v1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**SkillSphere** is a full-stack MERN application that enables users to exchange skills without monetary involvement. Connect with learners, barter your expertise, and grow together!

## ✨ Features

### 🔐 **Authentication & Security**
- JWT-based authentication
- Protected routes
- Secure password hashing with bcrypt
- Auto-logout on token expiration

### 👤 **Profile Management**
- Customizable user profiles
- Bio editing
- Avatar upload (Cloudinary)
- Add/remove skills offered and wanted

### 🔄 **Barter Request System**
- Send skill exchange requests
- Accept/reject incoming requests
- Track request status (Pending, Accepted, Completed, Rejected)
- Email notifications for requests

### 💬 **Real-Time Chat**
- Socket.IO powered messaging
- Text and media support
- Typing indicators
- Message history

### 🎥 **Session Management**
- Google Meet integration
- Ready status tracking
- Session scheduling
- Both participants must be ready to join

### 🗂 **Barter History**
- View all past and current barters
- Filter by status
- Beautiful modal interface

### 🎨 **Modern UI/UX**
- Glassmorphism design
- Framer Motion animations
- GSAP scroll effects
- Tailwind CSS styling
- Responsive design
- Dark theme with gradients

## 🛠 Tech Stack

### **Frontend**
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- GSAP
- Socket.IO Client
- Axios
- React Router DOM

### **Backend**
- Node.js
- Express
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication
- Cloudinary (media uploads)
- Nodemailer (email notifications)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Gmail account (for email notifications)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd SkillSphere
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file
cp .env.example .env
```

Edit `server/.env` with your credentials:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Create .env file
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

### Start Frontend
```bash
cd client
npm run dev
```
Frontend runs on `http://localhost:5173`

## 📧 Email Configuration

To enable email notifications:

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in your `.env` file as `EMAIL_PASS`

## ☁️ Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the dashboard
3. Add them to your `.env` file

## 📱 Usage

1. **Register**: Create an account with your skills
2. **Discover**: Browse users and their offered skills
3. **Request**: Send barter requests to exchange skills
4. **Chat**: Once accepted, chat with your learning partner
5. **Session**: Schedule Google Meet sessions
6. **Learn**: Exchange knowledge and mark as completed

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/skills` - Update skills

### Barter Requests
- `POST /api/barters` - Create request
- `GET /api/barters` - Get user's requests
- `PUT /api/barters/:id/accept` - Accept request
- `PUT /api/barters/:id/reject` - Reject request
- `PUT /api/barters/:id/complete` - Complete request

### Chat
- `POST /api/chats` - Get or create chat
- `GET /api/chats/:id/messages` - Get messages
- `POST /api/chats/:id/messages` - Send message

### Sessions
- `POST /api/sessions` - Create session
- `GET /api/sessions/barter/:barterId` - Get session
- `PUT /api/sessions/:id/ready` - Mark as ready

### Upload
- `POST /api/upload` - Upload file to Cloudinary

## 🎨 Design Features

- **Glassmorphism**: Modern frosted glass effect
- **Gradients**: Beautiful color transitions
- **Animations**: Smooth Framer Motion effects
- **Responsive**: Mobile-first design
- **Dark Theme**: Eye-friendly interface

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for the skill-sharing community

## 🙏 Acknowledgments

- React Team
- MongoDB Team
- Socket.IO Team
- Tailwind CSS Team
- Framer Motion Team

---

**Happy Skill Sharing! 🎓✨**
