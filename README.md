# NeonDentalProstectics

An interactive, frontend-only dental practice workspace built with Next.js App Router, React, TypeScript, Tailwind CSS, Radix/shadcn-style primitives, Lucide, Recharts, React Hook Form, and Zod.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open the Local URL printed in the terminal. If port 3000 is busy:

```sh
npm run dev -- --port 3107
```

For a production build:

```sh
npm run build
npm start
```

## Workspace

- Dashboard with statistics derived from shared records.
- Patients: registration, validation, search, filters, sorting, pagination, selection, export, profiles, and archival.
- Clinical records: draft, edit, finalize, and cancel workflows.
- Dental chart: 32 permanent teeth, FDI/Universal numbering, multiple selection, conditions, notes, and history.
- Appointments: day/week/month calendar, scheduling, rescheduling, status changes, professional filters, working-hour validation, and overlap detection.
- Treatment plans: linked procedures and calculated estimates.
- Procedure catalog and fictional prescription forms with repeatable medications and print previews.
- Laboratory: specifications, workflow advancement, status history, technical notes, and quality-control records.
- Billing: invoice items, quantities, discounts, integer minor-unit calculations, simulated partial payments, payment history, and printable invoices/receipts.
- Reports: date filters, charts, workload, planned turnaround, CSV, and browser printing.
- Staff, notification read status, local settings, color/logo previews, and reset demo data.
- Global search with Cmd/Ctrl+K.

## Data and boundaries

All records are fictional. This application has no backend, database, authentication, payment gateway, or external notifications. Data is saved only in this browser's localStorage. Do not enter real patient data. Clearing browser storage removes the demo records and settings; Settings → Reset demo data restores the original data.

Attachments retain file names only, without retaining file content. The logo is stored as a small local data URL. Prescriptions are fictional demonstrations, not valid prescriptions. Role selection illustrates roles and does not enforce authorization.

Current limitations: turnaround reports show planned time rather than measured delivery time; calendar appointments are rescheduled using the edit form rather than drag-and-drop. Full keyboard tab-panel behavior, screen-reader auditing, mobile-device testing, and print-output verification remain follow-up quality checks.

## Structure

- `src/app/`: explicit module and detail routes, shared root layout, styles.
- `src/components/app.tsx`: application shell and reusable page, table, form, dialog, chart, and detail components.
- `src/components/ui/button.tsx`: reusable button primitive and style variants.
- `src/lib/data.ts`: shared fictional records, workflows, calculations, and seed generation.
- `src/types/index.ts`: shared data types.
- `PROJECT-BRIEF.md`: original specification.

## Verification

Use `npm run typecheck` and `npm run build`. Browser verification exercises required-field errors, patient registration and dashboard updates, tooth findings, laboratory advancement, and partial payment balances. See `QA.md` for the recorded checks and remaining limits.
