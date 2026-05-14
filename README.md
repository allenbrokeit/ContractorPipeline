# Contractor Pipeline

## Project Title & Description
**Contractor Pipeline** is a specialized CRM and project management dashboard designed for independent contractors to effectively track their client engagements and financial health. 

Built entirely with the **Symbols.app (DOMQL v3)** design-system framework, the architecture leverages a highly reactive, pure-object component model. It eliminates traditional HTML/React boilerplate in favor of a state-driven UI. The core problem it solves is providing a unified, instantly reactive workspace where contractors can seamlessly transition between tracking sales pipelines, managing international client contact details, and visualizing their monthly revenue targets—all within a single, cohesive dashboard.

## Features & Use Cases
* **Interactive Pipeline Management:** Track and filter projects across multiple lifecycle stages (Lead, Pitched, Negotiating, Active, Pending, Declined).
* **Dynamic Financial Health Gauge:** A highly visual, reactive progress bar that tracks secured revenue vs. pipeline revenue against an easily adjustable monthly target.
* **Intelligent Contact Management:** Edit client details inline, featuring robust international phone number formatting, dynamic country-code dropdowns, and automatic country flag tooltip generation.
* **State-Driven Display Modes:** Seamlessly toggle between read-only display modes and active edit modes with full VDOM reactivity.

**Use Cases:**
* Freelancers and contractors needing a lightweight, visual CRM to track multiple concurrent bids and active projects.
* Small agencies monitoring their monthly financial pipeline to ensure they hit revenue targets.

## Prerequisites
Before installing, ensure your system meets the following requirements:
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (v8.0.0 or higher)
* Familiarity with the [Symbols.app / DOMQL](https://symbols.app/) ecosystem.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/allenbrokeit/ContractorPipeline.git
   cd ContractorPipeline
   ```

2. **Install local dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory if required by your hosting provider, and add the necessary tokens:
   ```env
   SYMBOLS_API_KEY=[INSERT API KEY HERE]
   ```

## Running the Application
The project uses the `@symbo.ls/cli` and Parcel for bundling. To boot up the application locally with hot-reloading:

```bash
npm run start
```
*The application will typically be available at `http://localhost:1234`.*

To build the production bundle:
```bash
npm run build
```

## Testing
To execute the automated test suite and verify the integrity of the DOMQL components and reactivity logic:

```bash
npm test
```

The test suite uses **Jest** with **jsdom** to headlessly verify:
- Hamburger menu state toggling and icon bar animations
- Responsive media query declarations (mobile vs. desktop visibility)
- Mobile menu expand/collapse reactivity
- Active route lightbar slide-in logic
- Navigation link completeness across desktop and mobile menus

## License
This project is licensed under the [MIT License](./LICENSE).
