# Contractor Pipeline

**Contractor Pipeline** is a specialized CRM and project management dashboard designed for independent contractors to effectively track client engagements, manage project lifecycles, and monitor financial health.

Built with the **Symbols.app (DOMQL v3)** design-system framework, the architecture leverages a highly reactive, object-based component model. This approach eliminates traditional HTML/React boilerplate in favor of a state-driven UI that is both performant and easily maintainable. The project provides a unified workspace for tracking sales pipelines, managing international client contacts, and visualizing revenue targets through a single, cohesive dashboard.

## Features & Use Cases

-   **Interactive Pipeline Management**: Track and filter projects through multiple stages: Lead, Pitched, Negotiating, Active, Pending, and Declined.
-   **Dynamic Financial Health Tracking**: A reactive "Monthly Aggregate vs Target" gauge that tracks secured vs. pipeline revenue against a user-adjustable monthly goal.
-   - **Intelligent Contact Management**: Inline editing for client details with international phone number formatting and dynamic country-code dropdowns with tooltips.
-   **Responsive Navigation**: A mobile-first hamburger menu system featuring animated bar transforms and a sliding lightbar indicator that tracks the active route.
-   **Cross-Page State Persistence**: Global state management (via `s.root`) ensures UI toggles like the mobile menu and modal states remain synchronized across different page routes.
-   **Automated Responsive Layouts**: Built-in logic to handle breakpoint crossovers (mobile to desktop) and force layout re-measurements for UI components that depend on physical DOM positions.

### Use Cases
-   **Freelancers**: Monitor multiple concurrent bids and active contracts in a lightweight, visual interface.
-   **Small Agencies**: Track monthly revenue pipelines to ensure sales targets are met.

## Prerequisites

Before installing, ensure your system meets the following requirements:

-   **Node.js**: v18.0.0 or higher recommended.
-   **npm**: v8.0.0 or higher.
-   **Symbols CLI**: The project uses `@symbo.ls/cli` for development and builds.
-   **Framework Knowledge**: Familiarity with the [Symbols.app / DOMQL](https://symbols.app/) ecosystem is highly recommended.

## Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/allenbrokeit/ContractorPipeline.git
    cd ContractorPipeline
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env` file in the root directory and add any required tokens (if applicable for your deployment environment):
    ```env
    SYMBOLS_API_KEY=[INSERT API KEY HERE]
    # Add other provider-specific variables as needed
    ```

## Running the Application

The project uses the Symbols CLI and Parcel for bundling.

### Development Mode
To start the local development server with hot-reloading:
```bash
npm run start
```
By default, the application will be available at [http://localhost:1234](http://localhost:1234).

### Production Build
To generate the optimized production bundle:
```bash
npm run build
```

## Testing

The project includes a comprehensive headless test suite using **Jest** and **jsdom** to verify the integrity of DOMQL components and reactivity logic. All test files are located in the `test/` directory.

To execute the tests:
```bash
npm test
```

The test suite validates:
-   **Hamburger Navigation**: Toggling logic, bar animations, and global state reactivity.
-   **Responsive Design**: Media query declarations and visibility across breakpoints.
-   **Active State Indicator**: The logic and transitions for the lightbar indicator under navigation links.
-   **Menu Consistency**: Ensuring all navigation links are present and correctly configured on both mobile and desktop views.

## MIT License

This project is licensed under the [MIT License](./LICENSE).

---
*Created and maintained by G. Allen Johnson.*
