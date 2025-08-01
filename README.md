# Blip Bank - Debt Renegotiation Chat System

An intelligent chat system for bank debt renegotiation, built with React, TypeScript, and n8n integration for workflow automation.

## Overview

Blip Bank is a web application that offers an automated chat for customers to renegotiate their bank debts in an intuitive and efficient way. The system uses artificial intelligence through n8n workflows to process requests and provide personalized payment options.

## Features

### Authentication and Registration
- Registration form with CPF and full name collection
- Automatic CPF formatting
- LGPD consent for data collection
- Real-time form validation

### Chat Interface
- Real-time chat with intelligent bot
- Responsive and modern interface
- Loading indicators during processing
- Persistent message history
- Light and dark theme toggle

### Intelligent Automation
- n8n integration for automated workflows
- Data processing via webhook
- Automatic debt verification in Google Sheets
- Discount calculation based on customer history
- Automatic email sending with payment details

### Data Management
- Google Sheets storage
- Conversation history
- Previous renegotiation tracking
- Automatic status updates

## Technologies Used

### Frontend
- **React 18** - Main framework
- **TypeScript** - Static typing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling

### Backend/Automation
- **n8n** - Workflow automation
- **Google Sheets API** - Data storage
- **Gmail API** - Email sending
- **OpenAI API** - Natural language processing

### Deployment
- **Vercel** - Hosting and deployment
- **Webhook** - Communication with n8n

## Project Structure

```
blip-bank/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── ChatInterface.tsx
│   │   ├── UserRegistrationForm.tsx
│   │   └── ThemeToggle.tsx
│   ├── pages/              # Application pages
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities
│   └── styles/             # Style files
├── public/                 # Static files
├── n8n-workflow.json      # n8n workflow configuration
└── docs/                   # Documentation
```

## How to Run

### Prerequisites
- Node.js 18+
- npm or yarn
- n8n account (for automation)
- Google Cloud Platform (for APIs)
- OpenAI API (for the agent)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-user/blip-bank.git
cd blip-bank
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
nano .env
```

Edit the `.env` file:
```env
VITE_WEBHOOK_URL=https://your-n8n-webhook.com/webhook/...
```

4. **Run in development**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## n8n Configuration

### Main Workflow
The `n8n-workflow.json` file contains the complete workflow configuration that:

1. **Receives webhook data** - Captures chat information
2. **Queries Google Sheets** - Verifies debt data
3. **Processes with AI** - Analyzes and responds via OpenAI
4. **Updates history** - Saves conversations
5. **Sends emails** - Confirms negotiations

### Main Nodes
- **Webhook** - Endpoint to receive messages
- **Google Sheets** - Data query and update
- **OpenAI Chat** - Natural language processing
- **Gmail** - Automatic email sending
- **Memory Buffer** - Conversation context

## Bot Features

### Discount Policy
- **1st renegotiation**: 10% discount
- **2nd renegotiation**: 20% discount  
- **3+ renegotiations**: 25% discount

### Payment Options
- **Cash payment** - With applied discount
- **Installments** - Up to 6x with 20% down payment

### Service Flow
1. Debt verification in the system
2. Presentation of personalized options
3. Email collection for detail sending
4. Database update
5. Email confirmation