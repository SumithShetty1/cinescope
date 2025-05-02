# CineScope - Movie Review Web Application

## Project Overview
CineScope is a modern web application designed for movie enthusiasts to discover, review, and manage their favorite films. Built with React for the frontend and Spring Boot for the backend, CineScope provides a seamless platform for users to explore movies, watch trailers, and maintain personalized watchlists. The application features secure authentication and delivers a rich, interactive user experience.

## Key Features
- **Movie Discovery**: Browse an extensive collection of movies with detailed information
- **Trailer Viewing**: Watch trailers directly within the application
- **Personalized Watchlists**: Create and manage your own movie watchlist
- **User Reviews**: Share your opinions and read reviews from other users
- **Secure Authentication**: Protected user accounts with Descope authentication
- **Responsive Design**: Fully functional across desktop and mobile devices

## Technologies Used:
- **Frontend**: HTML, CSS, JavaScript, React (JavaScript), React Router, Axios, React Bootstrap, Material UI (MUI), FontAwesome, Emotion, React Player, React Slick, Slick Carousel
- **Backend**: Java, Spring Boot, Spring Web, Spring Data MongoDB, Spring Boot DevTools, Spring Dotenv, Lombok
- **Authentication**: Descope (React SDK and Java SDK)
- **Database**: MongoDB (Cloud-hosted via MongoDB Atlas)
- **API**: RESTful APIs
- **Build Tools**: Vite, Maven
- **Containerization**: Docker (multi-stage build)
- **Deployment**: Vercel (Frontend), Render (Docker-based Backend Deployment)

This project demonstrates the integration of modern web technologies with comprehensive movie management solutions, offering a flexible and engaging platform for film enthusiasts to discover, review, and organize their favorite movies.

## How to Use This Source Code

### Prerequisites
- VS Code (for frontend development)
- IntelliJ IDEA Community Edition (for backend development)
- Node.js (v18+ recommended)
- Java 21 JDK
- Maven (comes bundled with IntelliJ)

### 1. Clone the Repository
```bash
git clone https://github.com/SumithShetty1/cinescope.git
```

### 2. Frontend Setup (VS Code)
1. **Open Project in VS Code**:
   - Launch VS Code
   - Select `File` → `Open Folder`
   - Navigate to and select the `cinescope/frontend` folder

2. **Open Terminal**:
   - Use the shortcut `Ctrl+`` ` (backtick) to open the integrated terminal
   - Or go to `Terminal` → `New Terminal` in the menu

3. **Install Dependencies and Run**:
   ```bash
   npm install
   npm run dev
   ```

4. **Access Frontend**:
    - The development server will start automatically
    - Open your browser and visit: http://localhost:3000

### 3. Backend Setup (IntelliJ IDEA)

1. **Open Project:**
    - Launch IntelliJ IDEA
    - Select `File` → `Open`
    - Navigate to and select the `cinescope/backend` folder

2. **Maven Configuration:**
    - Locate `pom.xml` in the project explorer
    - Right-click → `Maven` → `Reload Project`
        - *This downloads all required dependencies*

3. **Run Application**
    - Navigate to: 
        ```bash
        src/main/java/com/cinescope/backend/BackendApplication.java
        ```

    - Run using either method:
        - Click the green arrow ▶️ next to `main()`
        - Or right-click → `Run 'BackendApplication.main()'`

4. **Verify Startup**
    - Wait for console message: 
        ```bash
        Started BackendApplication in X.XXX seconds
        ```
    - Backend will run at: [http://localhost:8080](http://localhost:8080)

### 4. Environment Configuration

#### Frontend
Create `.env` in `/frontend`:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_DESCOPE_PROJECT_ID=your-project-id
```
#### Backend
Create .env in `/backend/src/main/resources`:
```env
MONGO_DATABASE=your-db-name
MONGO_USER=your-db-user
MONGO_PASSWORD=your-db-password
MONGO_CLUSTER=your-cluster-url
DESCOPE_PROJECT_ID=your-descope-id
ALLOWED_ORIGINS=http://localhost:3000
```

## First-Time Setup Notes
- Allow 2-3 minutes for Maven dependencies to download
- If backend fails:
    - Verify Java 21 SDK (File → Project Structure)
    - Reimport Maven projects (Maven panel → Refresh button)
- Frontend auto-reloads on file changes

## Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/v1
