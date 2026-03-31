# Marc Dy - Portfolio Website

A modern, responsive portfolio website showcasing my software engineering projects, CAD designs, and skills.

## Live Demo

Visit the live site: [marccarlody.com](https://marccarlody.com)

## Built With

- **Next.js 16.2** - React framework with App Router and Turbopack
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **@chenglou/pretext** - DOM-free text layout engine for obstacle-aware typography
- **Lucide React** - Icon library
- **Formspree** - Contact form handling
- **shadcn/ui** - UI component primitives

## Features

- **Editorial Hero** - Canvas-rendered bio text that flows around your name using Pretext's multi-obstacle layout engine, with glitch animation and mouse-follow
- **Crosshair Cursor** - Consistent crosshair cursor throughout the site
- **Scroll Progress Bar** - Cyan progress indicator in the navbar
- **Interactive Project Cards** - Per-project animated backgrounds with themed interfaces
- **CAD Project Gallery** - Multi-image cards with overlaid thumbnail strip and lightbox with keyboard navigation
- **Contact Form** - Rate limiting, honeypot spam protection, and input validation
- **Email Obfuscation** - Base64-encoded email decoded client-side to prevent scraping
- **Scroll Spy Navigation** - Centered navbar with auto-highlighting active section
- **Toast Notifications** - Bottom-right toasts with progress bar and dismiss button
- **Performance Optimized** - Next.js Image optimization, lazy loading, and intersection observer

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/decentaro/marc-dy-portfolio.git
cd marc-dy-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router + globals.css
├── components/
│   ├── sections/        # Page sections (Hero, Projects, CAD, Contact, Navigation)
│   └── ui/              # Reusable UI components (ProjectCard, EditorialHero, etc.)
├── hooks/               # Custom React hooks (useScrollSpy, useBalancedText, etc.)
└── lib/                 # Utility functions
```

## Sections

- **Hero** - Editorial canvas layout with Pretext obstacle-aware text flow, name glitch animation, typewriter CTA, and skills grid
- **Projects** - Featured software projects with row-leveled cards and interactive animated backgrounds
- **CAD** - 3D design projects with image galleries, lightbox, and keyboard navigation
- **Contact** - Contact form + info panel with availability status

## Security

- Email obfuscation with client-side decoding
- Form rate limiting and honeypot spam detection
- Input validation and sanitization
- Content Security Policy (CSP) headers

## Deployment

Optimized for [Vercel](https://vercel.com/):

1. Push to GitHub
2. Connect repository to Vercel
3. Deploys automatically on every push

## Contact

Marc Dy - [github.com/decentaro](https://github.com/decentaro)
