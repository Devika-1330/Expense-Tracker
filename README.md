<div align="center">

# 💳 Expense Tracker & Financial Dashboard

A modern personal finance management platform built with **Next.js, TypeScript, Tailwind CSS, and Docker**.

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white" alt="Radix UI"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
</p>

<p>
  <a href="https://github.com/Devika-1330/expense-tracker">View Repository</a>
</p>

</div>

---

## 🌟 Overview

**Expense Tracker & Financial Dashboard** is a personal finance management application designed to help users organize their finances and understand their spending habits.

The application provides a centralized interface for recording transactions, categorizing expenses, monitoring income, and reviewing financial summaries through an interactive dashboard.

Its responsive interface and modern application architecture make financial information easier to manage and understand.

---

## ✨ Key Features

* 📊 **Interactive Financial Dashboard:** View financial summaries, income, expenses, and available balance.
* 🔐 **Authentication:** Sign-up, login, and authentication-related route management.
* 🏷️ **Expense Categorization:** Organize transactions into categories such as groceries, utilities, entertainment, and investments.
* 💰 **Transaction Management:** Maintain records of personal financial transactions.
* 📈 **Financial Insights:** Review spending patterns and category-wise expense breakdowns.
* 🎨 **Responsive User Interface:** Build a modern interface using Tailwind CSS and reusable UI components.
* 🐳 **Docker Support:** Containerize the application for development and deployment.
* ⚡ **Modern Architecture:** Use the Next.js App Router and a combination of server and client components.

---

## 🛠️ Tech Stack

| Category                | Technologies          |
| ----------------------- | --------------------- |
| Framework               | Next.js               |
| Programming Language    | TypeScript            |
| Frontend                | React                 |
| Styling                 | Tailwind CSS, PostCSS |
| UI Components           | Radix UI, shadcn/ui   |
| Icons                   | Lucide Icons          |
| Form Management         | React Hook Form       |
| Containerization        | Docker                |
| Container Orchestration | Docker Compose        |
| Package Managers        | pnpm / npm            |
| Version Control         | Git, GitHub           |

---

## 📂 Project Structure

```text
expense-tracker/
├── app/
│   ├── (auth)/              # Authentication-related routes
│   ├── dashboard/           # Financial dashboard and analytics
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root application layout
│   └── page.tsx             # Home page
├── components/              # Reusable UI components
├── hooks/                   # Custom React hooks
├── lib/                     # Helper functions and utilities
├── public/                  # Static assets
├── Dockerfile               # Production Docker configuration
├── Dockerfile.dev           # Development Docker configuration
├── docker-compose.yml       # Docker Compose configuration
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

> **Note:** This structure is based on the provided project details. Adjust the directory names and files to match your actual repository.

---

## 🚀 Getting Started

Follow these steps to run the application locally.

### Prerequisites

Ensure that you have one of the following environments available:

**Option 1: Node.js**

* Node.js version 18.17.0 or later, compatible with your project's Next.js version.
* npm or pnpm.

**Option 2: Docker**

* Docker installed and running.
* Docker Compose available.

### Option A: Run with Node.js

**1. Clone the repository**

```bash
git clone https://github.com/Devika-1330/expense-tracker.git
cd expense-tracker
```

**2. Install dependencies**

Using pnpm:

```bash
pnpm install
```

Or using npm:

```bash
npm install
```

**3. Configure environment variables**

If your repository contains an `.env.local.example` file, copy it:

```bash
cp .env.local.example .env.local
```

Configure the required environment variables in `.env.local` according to your project setup.

**4. Start the development server**

Using pnpm:

```bash
pnpm dev
```

Or using npm:

```bash
npm run dev
```

**5. Open the application**

Visit:

```text
http://localhost:3000
```

### Option B: Run with Docker 🐳

Make sure Docker is running and that the relevant Docker configuration files exist in your repository.

**Start the development environment:**

```bash
docker compose -f docker-compose.dev.yml up --build
```

**Or start the production environment:**

```bash
docker compose up --build -d
```

Open the application at:

```text
http://localhost:3000
```

> **Note:** Use the Compose filename and commands that match your actual project configuration. The development Compose file must exist for the first command to work.

---

## ⚙️ Available Scripts

The following are common Next.js scripts. Confirm that they are defined in your `package.json`.

| Command      | Description                                  |
| ------------ | -------------------------------------------- |
| `pnpm dev`   | Starts the development server.               |
| `pnpm build` | Builds the application for production.       |
| `pnpm start` | Starts the production server after building. |
| `pnpm lint`  | Runs the configured linting script.          |

For npm, replace `pnpm` with `npm run` where appropriate.

---

## 🎯 Project Objectives

* Simplify personal expense tracking and transaction management.
* Organize financial records using expense categories.
* Present financial summaries through an accessible dashboard.
* Develop a responsive application using modern web technologies.
* Explore containerization and application deployment with Docker.

---

## 👩‍💻 Author

**Devika S**

* **GitHub:** [@Devika-1330](https://github.com/Devika-1330)
* **Project Repository:** [Expense Tracker](https://github.com/Devika-1330/expense-tracker)
* **Location:** Trivandrum, Kerala, India

---

<div align="center">

### 💡 Managing expenses. Understanding spending. Making informed decisions.

**Thank you for visiting this project!** ⭐

</div>
