# Setup Instructions

Since Node.js and npm are not currently installed on your system, follow these steps to get the app running:

## Step 1: Install Node.js

1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version for Windows
3. Run the installer and follow the prompts
4. Accept the default settings (this will install both Node.js and npm)
5. Restart your terminal/PowerShell after installation

## Step 2: Verify Installation

Open a new terminal and run:

```bash
node --version
npm --version
```

Both commands should display version numbers.

## Step 3: Navigate to Project Directory

```bash
cd "C:\Users\Sreepadma Vankadara\.gemini\antigravity\scratch\token-kalc"
```

## Step 4: Install Project Dependencies

```bash
npm install
```

This will download all required packages (React, Vite, Chart.js, etc.)

## Step 5: Start the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Alternative: Use a Different Package Manager

If you prefer, you can use other package managers:

### Using Yarn:
```bash
# Install Yarn globally
npm install -g yarn

# Install dependencies
yarn

# Run dev server
yarn dev
```

### Using pnpm:
```bash
# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install

# Run dev server
pnpm dev
```

## Quick Start (After Node.js is Installed)

```bash
cd "C:\Users\Sreepadma Vankadara\.gemini\antigravity\scratch\token-kalc"
npm install
npm run dev
```

That's it! The app should be running at http://localhost:5173
