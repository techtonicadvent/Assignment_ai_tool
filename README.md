### **Project Name**

AI Tools Chat Assistant

### **What does the app do?**

AI assistant that lets users chat, fetch real-time weather, stock prices, and Formula-1 race data, with persistent multi-session history per user.

### **Main Features**

* Multi-chat conversations with sidebar history
* AI-generated chat titles
* Weather lookup by city
* Stock price lookup by symbol
* Formula-1 race information
* Chat summarization feature
* User authentication (Google/GitHub login)
* Persistent database storage per user
* Modern ChatGPT-like dark UI

### **Framework / Library**

* Next.js (App Router)
* React (Client + Server Components)
* TypeScript

### **Styling**

* Tailwind CSS
* Custom design tokens for dark theme UI

### **Backend**

* Next.js API Routes
* Neon PostgreSQL database
* Drizzle ORM

# 🔑 API Info

### **External APIs Used**

* Weather API (WeatherAPI / OpenWeather depending on config)
* Financial data API for stocks
* Formula-1 race schedule API

### **Environment Variables**

DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL

GOOGLE_ID
GOOGLE_SECRET
GITHUB_ID
GITHUB_SECRET

WEATHER_API_KEY
STOCK_API_KEY


Run Instructions

### **Package Manager**

npm

### **Install**

```
npm install
```

### **Run Dev Server**

```
npm run dev
```

### **Build for Production**

```
npm run build
npm start
```

---

# Special Features

* Secure authentication using NextAuth
* AI-assisted chat titles & summarization
* Persistent chats stored per user in PostgreSQL
* Modular API tool system (weather / stock / F1)
* Fully responsive ChatGPT-style interface
* Built with modern full-stack architecture (Next.js App Router + Server Actions ready)
