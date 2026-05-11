# ContractorPipeline Design System

This document serves as the single source of truth for the design system used in the ContractorPipeline project. It is intended to be used by both developers and AI agents to ensure visual consistency across all components and layouts.

---

## 1. Color System

The color system is built on a dark, slate-based palette with semantic overlays for project health and UI feedback.

### Foundational Palette

```json
{
  "palette": {
    "slate": {
      "900": "#0F172A",
      "800": "#1E293B",
      "700": "#334155",
      "600": "#475569",
      "500": "#64748B",
      "400": "#94A3B8",
      "300": "#CBD5E1",
      "200": "#E2E8F0",
      "100": "#F1F5F9",
      "50": "#F8FAFC"
    },
    "emerald": {
      "500": "#10B981"
    },
    "amber": {
      "500": "#F59E0B"
    },
    "red": {
      "500": "#EF4444"
    },
    "blue": {
      "500": "#3B82F6"
    }
  }
}
```

### Semantic Tokens

```json
{
  "semantic": {
    "background": "slate.900",
    "surface": "slate.800",
    "border": "slate.700",
    "text-primary": "slate.50",
    "text-secondary": "slate.400",
    "accent": "blue.500",
    "success": "emerald.500",
    "secured": "emerald.500",
    "warning": "amber.500",
    "at-risk": "amber.500",
    "error": "red.500",
    "critical": "red.500"
  }
}
```

---

## 2. Typography System

The typography system uses a modular scale to ensure hierarchy and readability.

### Fonts

```json
{
  "fonts": {
    "sans": "San Francisco, Helvetica Neue, Helvetica, Arial, sans-serif",
    "body": "San Francisco, Helvetica Neue, Helvetica, Arial, sans-serif",
    "heading": "San Francisco, Helvetica Neue, Helvetica, Arial, sans-serif"
  }
}
```

### Sizing Scale (Base 16px, Ratio 1.25)

```json
{
  "scale": {
    "X": "8.19px",
    "Y": "10.24px",
    "Z": "12.8px",
    "A": "16px",
    "B": "20px",
    "C": "25px",
    "D": "31.25px"
  }
}
```

### Text Styles

```json
{
  "styles": {
    "h1": {
      "fontSize": "D",
      "fontWeight": "700",
      "margin": "0 0 1em 0"
    },
    "h2": {
      "fontSize": "C",
      "fontWeight": "700",
      "margin": "0 0 0.5em 0"
    },
    "h3": {
      "fontSize": "B",
      "fontWeight": "700",
      "margin": "0 0 0.25em 0"
    },
    "label": {
      "fontSize": "Z",
      "fontWeight": "600",
      "textTransform": "uppercase",
      "letterSpacing": "0.05em",
      "color": "text-secondary"
    },
    "body": {
      "fontSize": "A",
      "fontWeight": "400",
      "color": "text-primary"
    }
  }
}
```

---

## 3. Spatial System

The spatial system uses a geometric progression to define consistent margins, paddings, and gaps.

### Base Unit

The core grid is built on a **16px** base.

### Scale (Ratio 1.618)

```json
{
  "spacing": {
    "V": "1.4px",
    "W": "2.3px",
    "X": "3.77px",
    "Y": "6.1px",
    "Z": "9.88px",
    "A": "16px",
    "B": "25.8px",
    "C": "41.8px",
    "D": "67.7px"
  }
}
```

### Breakpoints

```json
{
  "breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px"
  }
}
```

---

## 4. Object Styles

Common visual properties for UI elements.

### Border Radius

```json
{
  "radius": {
    "none": "0",
    "xs": "V",
    "sm": "W",
    "md": "X",
    "lg": "Y",
    "xl": "Z",
    "2xl": "A",
    "full": "9999px"
  }
}
```

### Shadows

```json
{
  "shadows": {
    "low": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    "high": "0 8px 30px rgba(0, 0, 0, 0.4)",
    "glass": "inset 0 0 0 1px rgba(255, 255, 255, 0.05)"
  }
}
```

---

## 5. Component Style Principles

### Buttons

```json
{
  "buttons": {
    "primary": {
      "background": "success",
      "color": "black",
      "padding": "Z A",
      "borderRadius": "W",
      "fontWeight": "600",
      "transition": "all 0.2s ease",
      "hover": {
        "filter": "brightness(1.1)",
        "transform": "translateY(-1px)"
      }
    },
    "secondary": {
      "background": "slate.700",
      "color": "slate.50",
      "padding": "Z A",
      "borderRadius": "W",
      "hover": {
        "background": "slate.600"
      }
    }
  }
}
```

### Form Inputs

```json
{
  "inputs": {
    "default": {
      "background": "background",
      "border": "1px solid rgba(255, 255, 255, 0.1)",
      "borderRadius": "W",
      "padding": "Z",
      "color": "text-primary",
      "fontSize": "A",
      "focus": {
        "borderColor": "accent",
        "boxShadow": "0 0 0 2px rgba(59, 130, 246, 0.2)"
      }
    }
  }
}
```

### Cards

```json
{
  "cards": {
    "default": {
      "background": "rgba(30, 41, 59, 0.6)",
      "backdropFilter": "blur(12px)",
      "border": "1px solid rgba(255, 255, 255, 0.05)",
      "borderRadius": "Z",
      "padding": "A",
      "boxShadow": "high"
    }
  }
}
```
