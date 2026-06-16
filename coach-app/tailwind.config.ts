import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  safelist: [
    "bg-coaching-career",
    "bg-coaching-executive",
    "bg-coaching-wellness",
    "bg-coaching-leadership",
    "bg-coaching-finance",
    "bg-coaching-performance",
    "bg-coaching-mindset",
    "bg-coaching-spiritual",
    "bg-coaching-mental",
    "bg-coaching-transform",
    "bg-coaching-communicate",
    "bg-coaching-organization",
    "bg-coaching-creativity",
    "bg-coaching-employee",
    "bg-coaching-corporate",
    "bg-coaching-confidence",
    "coaching-card-shadow",
    "coaching-card-shadow-hover",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        violet: {
          light: "hsl(var(--violet-light))",
          mid: "hsl(var(--violet-mid))",
          dark: "hsl(var(--violet-dark))",
        },
        warm: {
          DEFAULT: "hsl(var(--warm))",
          light: "hsl(var(--warm-light))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        danger: "hsl(var(--danger))",
        info: "hsl(var(--info))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "coaching-career": "hsl(var(--coaching-career))",
        "coaching-executive": "hsl(var(--coaching-executive))",
        "coaching-wellness": "hsl(var(--coaching-wellness))",
        "coaching-leadership": "hsl(var(--coaching-leadership))",
        "coaching-finance": "hsl(var(--coaching-finance))",
        "coaching-performance": "hsl(var(--coaching-performance))",
        "coaching-mindset": "hsl(var(--coaching-mindset))",
        "coaching-spiritual": "hsl(var(--coaching-spiritual))",
        "coaching-mental": "hsl(var(--coaching-mental))",
        "coaching-transform": "hsl(var(--coaching-transform))",
        "coaching-communicate": "hsl(var(--coaching-communicate))",
        "coaching-organization": "hsl(var(--coaching-organization))",
        "coaching-creativity": "hsl(var(--coaching-creativity))",
        "coaching-employee": "hsl(var(--coaching-employee))",
        "coaching-corporate": "hsl(var(--coaching-corporate))",
        "coaching-confidence": "hsl(var(--coaching-confidence))",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        "coaching-card": "0 2px 16px -4px hsl(220 60% 20% / 0.08), 0 1px 4px -2px hsl(220 60% 20% / 0.04)",
        "coaching-card-hover": "0 8px 30px -8px hsl(220 60% 20% / 0.14), 0 2px 8px -2px hsl(220 60% 20% / 0.06)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", height: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", height: "var(--radix-collapsible-content-height)", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "1", height: "var(--radix-collapsible-content-height)" },
          "100%": { opacity: "0", height: "0" },
        },
        "scale-pop": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "check-draw": {
          "0%": { strokeDashoffset: "24" },
          "100%": { strokeDashoffset: "0" },
        },
        "check-pop": {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        "ring-fill": {
          "0%": { strokeDashoffset: "var(--ring-circumference)" },
          "100%": { strokeDashoffset: "var(--ring-offset)" },
        },
        "press": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.96)" },
          "100%": { transform: "scale(1)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0.4)" },
          "70%": { boxShadow: "0 0 0 10px hsl(var(--primary) / 0)" },
          "100%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out forwards",
        "slide-up": "slide-up 0.3s ease-out forwards",
        "scale-pop": "scale-pop 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "check-draw": "check-draw 0.4s ease-out forwards",
        "check-pop": "check-pop 0.3s ease-out",
        "ring-fill": "ring-fill 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "press": "press 0.2s ease-out",
        "shimmer": "shimmer 2s infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.5s ease-out",
      },
    },
  },
  plugins: [animate],
};

export default config;
