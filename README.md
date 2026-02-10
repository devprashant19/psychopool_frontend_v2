# 🎮 Psycho Pool

**Psycho Pool** is a high-energy, real-time multiplayer quiz game built with **React**, **Vite**, and **Socket.io**. It features a unique "Minority Report" style gameplay where players must strategically choose answers to survive. The game includes a stunning "Neon Arcade" aesthetic, real-time leaderboards, and a powerful Admin Dashboard for game management.

---

## ✨ Features

### 🕹️ Player Experience
- **Real-time Gameplay**: Instant updates for questions, timer, and results.
- **Immersive UI**: "Neon Arcade" theme with glassmorphism, glowing effects, and smooth Framer Motion animations.
- **Responsive Design**: Optimized for mobile and desktop play.
- **Dynamic States**: Seamless transitions between Lobby, Question, Results, and Leaderboard screens.

### 🛡️ Admin Dashboard
- **Game Control**: Full control over the game flow (Start Round, Next Question, Reveal Results, End Game).
- **Live Stats**: Monitor active player count and game status in real-time.
- **Dual Modes**:
  - **💎 Normal Mode**: The **MINORITY** vote wins (Strategic survival).
  - **🔥 Chaos Mode**: The **MAJORITY** vote wins (Crowd rule).
- **Secure Access**: Password-protected admin interface.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Hosting**: [Vercel](https://vercel.com/) (Frontend), [Google Cloud](https://cloud.google.com/) (Backend)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Real-time Communication**: [Socket.io Client](https://socket.io/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API (`GameContext`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Backend Server: [https://github.com/devprashant19/psycho-pool-backend](https://github.com/devprashant19/psycho-pool-backend.git)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/devprashant19/psycho-pool-frontend.git
   cd psycho-pool-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   ```
   *(Replace with your deployed backend URL if applicable)*

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   - **Player View**: `http://localhost:8080`
   - **Admin Dashboard**: `http://localhost:8080/admin`

### Building for Production

To create a production build:
```bash
npm run build
```

### Linting

To run the linter:
```bash
npm run lint
```

---

## 📂 Project Structure

```bash
src/
├── components/
│   ├── admin/          # Admin Dashboard components
│   │   └── AdminDashboard.tsx
│   ├── player/         # Player view components
│   │   ├── LoginScreen.tsx
│   │   ├── LobbyScreen.tsx
│   │   ├── QuestionScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   └── PlayerView.tsx
│   └── ui/             # Reusable UI components (Shadcn)
├── contexts/           # Global state (GameContext)
├── services/           # Socket.io service configuration
├── App.tsx             # Main entry point & Routing logic
└── gamified-theme.css  # Custom animations and neon theme styles
```

---

## 🎮 How to Play

1. **Join**: Players enter their name to join the lobby.
2. **Vote**: When a question appears, select an answer before the timer runs out.
3. **Survive**:
   - In **Normal Mode**, choose the option with the **LEAST** votes to survive.
   - In **Chaos Mode**, choose the option with the **MOST** votes to win.
4. **Win**: The last standing player or the one with the highest score wins!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.
