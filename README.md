# Contractor Pipeline & Forecaster

A professional dashboard application designed for independent contractors, freelancers, and small agencies to visually manage their sales pipelines and forecast future workload capacity.

## Project Overview

The **Contractor Pipeline & Forecaster** provides a comprehensive suite of tools to track prospective leads and visualize active contracts. Built with **DOMQL v3** and the **Symbols.app** framework, the application utilizes a reactive, state-driven architecture to ensure real-time UI updates and a seamless user experience.

The core objective of the project is to solve the "capacity bottleneck" problem by horizontally plotting active and prospective contracts onto a 12-month rolling Gantt-style timeline, allowing users to see exactly when they are overbooked or have room for new projects.

### Architecture
- **Frontend Framework**: [DOMQL](https://domql.com/) (v3)
- **Design System**: [Symbols.app](https://symbols.app/)
- **Bundler**: [Parcel](https://parceljs.org/)
- **State Management**: Reactive state proxy system (internal to DOMQL)

---

## Features & Use Cases

### Key Features
- **Kanban Sales Pipeline**: A drag-and-drop board for tracking proposals through `Lead`, `Pitched`, `Negotiating`, and `Closed` stages.
- **Contract Conversion Modal**: A streamlined UI to finalize contract terms (start date, duration, monthly value) when a proposal is "Won".
- **12-Month Gantt Timeline**: A dynamic horizontal visualization that plots active contracts against the calendar year (Q1-Q4).
- **Financial Health Gauge**: Real-time metrics visualization to monitor pipeline value against monthly thresholds.
- **Responsive Dashboard Layout**: A premium, clean interface optimized for desktop management of complex project data.

### Use Cases
- **Freelance Capacity Planning**: Visualize overlapping projects to avoid over-commitment.
- **Agency Sales Tracking**: Manage multiple client proposals and track conversion rates.
- **Revenue Forecasting**: Estimate future income based on active contracts and high-probability leads.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: version 18.x or higher
- **npm**: version 9.x or higher
- **Symbols CLI**: (Optional) Recommended for advanced project management
  ```bash
  npm install -g @symbo.ls/cli
  ```

---

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/allenbrokeit/ContractorPipeline
   cd ContractorPipeline
   ```

2. **Install local dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory if you plan to integrate with a live backend.
   ```text
   # For future Supabase/Database integration
   SUPABASE_URL=[INSERT SUPABASE URL HERE]
   SUPABASE_KEY=[INSERT SUPABASE ANON KEY HERE]
   ```
   > [!NOTE]
   > The application currently runs on mocked data located in `symbols/state.js`. Live database integration requires manual modification of data-fetching handlers.

---

## Running the Application

To start the development server and view the application:

```bash
npm start
```

Once the command is running, open your browser and navigate to:
**`http://localhost:1234`**

### Additional Commands
- **Build for Production**: `npm run build`
- **Deploy to Symbols Network**: `npm run deploy`

---

## Testing

Currently, this project does not include an automated test suite. 

To implement tests in the future, it is recommended to use **Playwright** or **Cypress** for End-to-End (E2E) testing of the Kanban drag-and-drop interactions and Gantt chart rendering.

[INSERT TESTING INSTRUCTIONS HERE IF IMPLEMENTED]

---

## Author & License

- **Author**: [INSERT AUTHOR NAME / @allenbrokeit]
- **License**: MIT (See [LICENSE](LICENSE) for details)
