# Crypto Wallet Manager

A clean, modern web app to connect your Ethereum wallet (MetaMask) and view your ETH balance and recent transaction history — deployed on GitHub Pages.

🔗 **Live app:** [https://dmoney25632.github.io/Crypto/](https://dmoney25632.github.io/Crypto/)

---

## Features

- 🦊 **MetaMask connect** via EIP-1193 (`window.ethereum`)
- 💰 **ETH balance** fetched with [ethers.js](https://ethers.org/)
- 🔎 **ENS name resolution** (if available for your address)
- 📜 **Recent transaction history** from Etherscan API — hash, date, from/to, value, status
- 🌙 **Dark mode UI** with glass-morphism cards and subtle animations
- 📱 Responsive layout

---

## Getting Started (Local Development)

### 1. Prerequisites

- [Node.js](https://nodejs.org/) v18 or newer
- [MetaMask](https://metamask.io/download/) browser extension

### 2. Clone & install

```bash
git clone https://github.com/dmoney25632/Crypto.git
cd Crypto/frontend
npm install
```

### 3. Add your Etherscan API key

Copy the example env file and fill in your key:

```bash
cp .env.example .env
```

Open `.env` and replace `YOUR_ETHERSCAN_API_KEY_HERE` with your real key.

#### How to get an Etherscan API key (free)

1. Go to [https://etherscan.io/register](https://etherscan.io/register) and create a free account.
2. After confirming your email, log in and visit [https://etherscan.io/myapikey](https://etherscan.io/myapikey).
3. Click **Add** to create a new API key — the free tier is sufficient.
4. Copy the key and paste it into your `.env` file:

```
VITE_ETHERSCAN_API_KEY=ABCDE12345...
```

> **Note:** The app still works without a key but you may hit Etherscan's public rate limit and see errors when loading transactions.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173/Crypto/](http://localhost:5173/Crypto/) in your browser.

---

## Production Build

```bash
cd frontend
npm run build
```

The compiled output is in `frontend/dist/`.

---

## GitHub Pages Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the frontend to GitHub Pages whenever you push to `main`.

### Manual setup steps (one-time)

1. **Enable GitHub Pages** in your repository:
   - Go to **Settings → Pages**.
   - Under **Build and deployment → Source**, select **GitHub Actions**.

2. **Add the Etherscan API secret** (optional but recommended):
   - Go to **Settings → Secrets and variables → Actions**.
   - Click **New repository secret**.
   - Name: `VITE_ETHERSCAN_API_KEY`
   - Value: your Etherscan API key.

After these steps, pushing to `main` will trigger a build and deploy automatically. Your app will be live at:

```
https://dmoney25632.github.io/Crypto/
```

---

## Project Structure

```
Crypto/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Pages deployment workflow
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── App.jsx           # Main app — wallet connect + balance
│   │   ├── App.css           # App styles
│   │   ├── TransactionList.jsx  # Tx history component
│   │   ├── TransactionList.css
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # React entry point
│   ├── .env.example          # Environment variable template
│   ├── index.html
│   ├── package.json
│   └── vite.config.js        # Vite config (base: /Crypto/)
└── README.md
```

---

## Tech Stack

- [React 19](https://react.dev/) + [Vite 7](https://vite.dev/)
- [ethers.js v6](https://ethers.org/) — wallet / balance
- [Etherscan API](https://docs.etherscan.io/) — transaction history
- GitHub Actions + GitHub Pages — CI/CD
