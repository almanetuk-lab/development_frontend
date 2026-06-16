# Intentional Connection — Frontend

A modern React + Vite frontend application for the **Intentional Connection** platform.

## Tech Stack

- **Framework:** React 18 (with JSX)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + PostCSS
- **Routing:** React Router
- **Linting:** ESLint

## Project Structure

```
src/
├── App.jsx              # Root application component & routing
├── main.jsx             # Application entry point
├── index.css            # Global styles
├── assets/              # Static assets (images, icons)
└── components/
    ├── MatchSystem/     # AI-powered matching & suggestions
    ├── admin/           # Admin panel components
    ├── blog/            # Blog section
    ├── cart/            # Cart / subscription features
    ├── charts/          # Data visualization components
    ├── chatsystem/      # Real-time chat UI
    ├── comman/          # Shared/common components
    ├── context/         # React context providers
    ├── dashboard/       # User dashboard
    ├── extensions/      # Feature extensions
    ├── home/            # Landing / home page
    ├── notifybell/      # Notification system
    ├── pages/           # Top-level page components
    ├── profiles/        # User profile views
    ├── services/        # API service integrations
    ├── settings/        # User settings
    ├── social/          # Social features
    └── userPlans/       # Subscription plan management
```

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/almanetuk-lab/development_frontend.git
   cd development_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Fill in your values in .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Environment Variables

Copy `.env.example` to `.env` and set the required values. Never commit `.env` directly — it is excluded via `.gitignore`.

## Notes

- All API integrations, authentication flows, and business logic are preserved as-is.
- Do not modify component logic or routing when making documentation changes.
- Branch: `master`
