# Water Purification & Filtration Methods — Interactive Chemistry

An interactive, educational website for a high school Chemistry project on **Water Purification & Filtration Methods**. Built with vanilla TypeScript, CSS, and [KaTeX](https://katex.org) for mathematical typesetting.

Inspired by [Bartosz Ciechanowski's](https://ciechanow.ski) interactive educational sites.

## Features

- **Interactive Filtration Simulator** — Click each layer of a sand-and-gravel filter to see what it removes
- **Distillation Animation** — Step-by-step animated distillation process with steam particles and condensation
- **Chemistry Equations** — Chemical formulas rendered with KaTeX (chlorination, coagulation, ion exchange, pH adjustment)
- **Water Treatment Calculator** — Two calculators:
  - Chlorine dosage (volume, target concentration, stock solution strength)
  - Dilution (C₁V₁ = C₂V₂)
- **Interactive Quiz** — 5 questions with instant feedback, progress tracking, and a final score circle
- **Dark/Light Theme Toggle** — Persists across sessions, respects system preference
- **Fully Responsive** — Works on mobile, tablet, and desktop
- **Accessible** — Skip links, ARIA labels, keyboard navigation, reduced-motion support

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Vite](https://vitejs.dev) | Build tool and dev server |
| [TypeScript](https://www.typescriptlang.org) | Type-safe JavaScript |
| [KaTeX](https://katex.org) | Math/chemistry equation rendering |
| Vanilla CSS | Styling (no preprocessor needed) |

No frameworks. No backend. Just clean, modular code.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+ (comes with npm)

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/water-purification-chemistry.git
cd water-purification-chemistry

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The site will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build    # Type-checks and builds to dist/
npm run preview  # Preview the production build locally
```

## Project Structure

```
water-purification-chemistry/
├── index.html                  # Semantic HTML5 — all content sections
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── vite.svg                 # Favicon
└── src/
    ├── main.ts                  # Entry point — imports all modules
    ├── style.css                # All styles, organized in numbered sections
    ├── vite-env.d.ts
    └── modules/
        ├── scrollProgress.ts    # Scroll progress bar at top of page
        ├── navigation.ts        # Sticky nav, mobile menu, active section
        ├── scrollReveal.ts      # Fade-in animations on scroll
        ├── statCounter.ts       # Animated counting numbers
        ├── methodCards.ts       # Expandable method cards
        ├── filtrationSimulator.ts # Interactive filter diagram
        ├── distillation.ts      # Step-by-step distillation animation
        ├── chemistryEquations.ts # KaTeX rendering
        ├── calculator.ts        # Chlorine dosage + dilution calculators
        ├── quiz.ts              # Interactive quiz with scoring
        └── themeToggle.ts       # Dark/light theme toggle
```

## How to Edit

### Changing Colors

All colors are defined as CSS custom properties (variables) at the top of `src/style.css` in the `:root` block. Change a value there and it updates everywhere.

Dark theme overrides are in the `html[data-theme="dark"]` block right below.

### Adding a Quiz Question

Edit `src/modules/quiz.ts`. The `questions` array at the top contains all quiz data:

```typescript
{
  question: 'Your question text?',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correct: 2,              // Index of correct answer (0-based)
  explanation: 'Why this is correct.',
}
```

### Adding a Method Card

Edit `src/modules/methodCards.ts`. Add a new object to the `methods` array:

```typescript
{
  name: 'Method Name',
  icon: '💧',              // Emoji icon
  summary: 'One-line summary',
  details: 'Detailed explanation...',
  tags: ['Tag1', 'Tag2'],
}
```

### Adding a Chemical Equation

Add a `<div>` with a `data-equation` attribute in `index.html`:

```html
<div class="chem-equation" data-equation="\ce{Your equation here}"></div>
```

KaTeX renders it automatically. See the [KaTeX docs](https://katex.org/docs/supported.html) for syntax.

## References

All factual claims and equations are sourced from:

1. **WHO** — Drinking Water Quality Guidelines (4th ed.)
2. **CDC** — Water Treatment Methods
3. **EPA** — Drinking Water Treatability Database
4. **Atkins & de Paula** — *Physical Chemistry for the Chemical Sciences*
5. **Brown et al.** — *Chemistry: The Central Science* (Pearson)

See the References section at the bottom of the website for full links.

## Contributing

This is a high school project, but improvements are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b my-feature`
3. Commit: `git commit -m 'Add some feature'`
4. Push: `git push origin my-feature`
5. Open a Pull Request

## License

MIT — feel free to use this for your own chemistry projects.

## Credits

- Math rendering: [KaTeX](https://katex.org)
- Design inspiration: [Bartosz Ciechanowski](https://ciechanow.ski)
- Built with [Vite](https://vitejs.dev)
