# PROJECT: NeonDentalProstectics Dental Management System

Act as a senior frontend engineer, expert UI/UX designer, and design systems architect.

Your task is to design and build a complete, modern, premium-quality dental management system frontend for **NeonDentalProstectics**, a dental prosthetics and dental care business.

## 1. PRIMARY OBJECTIVE

Build the entire frontend user interface first.

**Use Next.js as the application framework. Focus exclusively on frontend development at this stage.**

Do not implement a backend, database, authentication server, API routes, or external service integrations.

Instead, use realistic mock data and local state to make the interface interactive and demonstrate how the complete application will work.

The result should look and feel like a real, production-quality dental management SaaS application, not a basic student project, static landing page, or generic admin dashboard.

Build the actual application inside the project files if you have access to a coding environment.

Do not stop after creating a plan, wireframe, or a few sample components.

Implement all the major pages, reusable components, navigation, forms, tables, modals, and interactions described below.

## 2. TECHNOLOGY STACK

Use the following technologies:

- Next.js with the App Router.
- React.
- TypeScript.
- Tailwind CSS.
- shadcn/ui for interface components.
- Lucide React for icons.
- Recharts for charts.
- React Hook Form for forms.
- Zod for frontend form validation.

Use Next.js as the sole application framework.

Do not introduce another frontend framework.

Do not use:
- A separate backend.
- PostgreSQL or another database.
- Neon database integration.
- Supabase.
- Prisma or Drizzle ORM.
- External authentication providers.
- API routes or server actions for backend functionality.

Use local mock data, React state, and browser localStorage where appropriate to simulate interactions.

Keep the code organized so a real backend can be integrated in a future development phase.

Use stable, compatible package versions.

## 3. BRAND IDENTITY

Business name: NeonDentalProstectics.

Industry: Dental care and dental prosthetics.

The brand should feel professional, welcoming, modern, precise, and trustworthy.

### Brand color palette

Use light orange as the primary brand color.

Define the following design tokens:

- Primary: #FFB366
- Primary hover: #F59A45
- Light orange: #FFE0BD
- Soft peach background: #FFF7F0
- White: #FFFFFF
- Main text: #292524
- Secondary text: #78716C
- Borders: #F0E5DA
- Success: #16A34A
- Warning: #D97706
- Error: #DC2626
- Informational: #2563EB

Use orange for:
- Primary action buttons.
- Active navigation indicators.
- Selected tabs.
- Important icons.
- Chart highlights.
- Small visual accents.

Use white backgrounds for the main content areas and soft peach backgrounds for subtle highlights.

Do not overuse orange.

Maintain strong text contrast and ensure buttons and status indicators remain accessible.

### Typography

Use Inter or Geist.

Use a clear typographic hierarchy:
- Large, bold page titles.
- Medium-weight section headings.
- Small, readable labels.
- Subtle secondary descriptions.

### Visual inspiration

Create an interface with the polish of modern SaaS products and professional healthcare applications.

The interface should feature:
- A spacious layout.
- Carefully aligned content.
- Consistent spacing.
- Rounded cards.
- Subtle borders.
- Minimal shadows.
- Elegant tables.
- Professional charts.
- Clear status badges.
- Refined hover states.
- Smooth transitions.

Avoid excessive gradients, oversized illustrations, unnecessary animations, and cluttered layouts.

The application must be attractive enough to present to a real dental business owner.

## 4. APPLICATION SHELL

Build a complete dashboard application layout.

### Sidebar

Create a fixed or collapsible sidebar on desktop.

Include:
- NeonDentalProstectics logo or a custom dental-inspired icon.
- Business name.
- Dashboard.
- Patients.
- Appointments.
- Dental Records.
- Treatment Plans.
- Dental Procedures.
- Prescriptions.
- Dental Laboratory.
- Billing & Payments.
- Reports & Analytics.
- Staff & Users.
- Notifications.
- Settings.

Use Lucide icons.

Highlight the active navigation item with a soft orange background and orange icon.

Allow the sidebar to collapse into an icon-only view.

On mobile, use a slide-out navigation drawer.

### Top navigation bar

Include:
- Breadcrumb navigation.
- Search button or search input.
- Notifications icon with an unread indicator.
- User avatar.
- User name.
- User role.
- Profile dropdown.

The search interface should open a search panel and search the available mock data.

The profile dropdown should contain functional demonstration options such as Profile, Preferences, and Sign Out.

Since authentication is not being implemented, Sign Out can reset the simulated session or return to a demo welcome screen.

### Main content

The main content area should:
- Adapt to the sidebar state.
- Use consistent horizontal padding.
- Support page-specific headers and actions.
- Be responsive on desktop, tablet, and mobile.

Create reusable page-header components with a title, description, breadcrumbs, and primary action.

## 5. REQUIRED PAGES

Implement every page below as a real Next.js route.

Use a shared application layout.

Suggested routes:

- `/dashboard`
- `/patients`
- `/patients/[id]`
- `/appointments`
- `/dental-records`
- `/treatment-plans`
- `/procedures`
- `/prescriptions`
- `/laboratory`
- `/laboratory/[id]`
- `/billing`
- `/billing/[id]`
- `/reports`
- `/staff`
- `/notifications`
- `/settings`

Every page must have its own appropriate content and interactions.

Do not create pages that only display a title and an empty box.

## 6. DASHBOARD PAGE

Route: `/dashboard`

Create an attractive overview dashboard.

### Page header

Title: Dashboard

Subtitle: "Welcome back. Here's what's happening at NeonDentalProstectics today."

Include a date display and a primary action button labeled "Register Patient".

### Summary cards

Create cards for:
- Total Patients.
- New Patients This Month.
- Today's Appointments.
- Completed Treatments.
- Active Laboratory Orders.
- Outstanding Payments.

Each card should include:
- A relevant icon.
- A realistic mock value.
- A short contextual label.
- A small trend indicator where appropriate.

Use subtle orange accents.

### Charts

Create attractive charts using Recharts.

Include:
1. Patient registration trends.
2. Appointment statistics.
3. Monthly revenue.
4. Laboratory order distribution.

Use realistic demonstration data and readable chart labels.

Clearly treat the values as sample data.

### Today's appointments

Create a table containing:
- Time.
- Patient.
- Patient ID.
- Appointment type.
- Assigned professional.
- Status.
- Actions.

Include buttons for viewing patient details and managing appointments.

### Recent patients

Display:
- Patient avatar or initials.
- Patient name.
- Patient ID.
- Contact information.
- Registration date.
- View action.

### Laboratory overview

Create a compact widget showing:
- Orders in production.
- Orders awaiting quality control.
- Orders ready for delivery.
- Overdue orders.

### Recent activity

Show a timeline of recent demonstration activities, including patient registrations, appointment updates, laboratory orders, and payments.

All dashboard statistics and charts should be generated from the shared mock data rather than being independently hardcoded into every component.

## 7. PATIENT MANAGEMENT

Route: `/patients`

Create a comprehensive patient management interface.

### Page header

Title: Patients

Subtitle: "Manage patient profiles, clinical history, and dental care records."

Include a prominent "Register Patient" button.

### Patient statistics

Display:
- Total patients.
- New this month.
- Active patients.
- Patients requiring follow-up.

### Patient table

Columns:
- Patient ID.
- Patient.
- Age.
- Phone.
- Last Visit.
- Next Appointment.
- Status.
- Actions.

Features:
- Search by name or patient ID.
- Filter by status.
- Sort columns.
- Pagination.
- Row selection.
- Responsive behavior.
- Three-dot action menus.
- View profile.
- Edit patient.
- Archive patient.

### Patient registration modal

Create a polished multi-section form.

Include:
- First name.
- Last name.
- Date of birth.
- Phone.
- Email.
- Sex, where appropriate.
- Address.
- Emergency contact.
- Medical history.
- Known allergies.
- Current medications.
- Dental history.
- Notes.

Use React Hook Form and Zod for client-side validation.

Provide clear validation errors and success notifications.

When the form is submitted, create a patient in local state, generate a mock patient ID, update the patient table, and update the dashboard statistics.

Persist the demonstration data to localStorage where appropriate.

Do not require users to reload the page to see changes.

## 8. PATIENT PROFILE

Route: `/patients/[id]`

Build a detailed patient profile.

### Profile header

Display:
- Patient avatar or initials.
- Full name.
- Patient ID.
- Age.
- Phone number.
- Email address.
- Patient status.

Include action buttons:
- Edit Patient.
- Schedule Appointment.
- Add Dental Record.
- More Actions.

### Profile summary cards

Show:
- Total visits.
- Upcoming appointment.
- Completed procedures.
- Outstanding balance.

### Tabs

Create the following tabs:

1. Overview.
2. Personal Information.
3. Medical History.
4. Dental History.
5. Dental Chart.
6. Treatment Plans.
7. Procedures.
8. Prescriptions.
9. Laboratory Orders.
10. Appointments.
11. Billing.
12. Clinical Notes.
13. Activity History.

Each tab should display relevant mock data.

Do not make all tabs display the same generic content.

### Overview tab

Include:
- Patient information.
- Recent clinical notes.
- Upcoming appointment.
- Recent procedures.
- Active treatment plans.
- Laboratory orders.
- Outstanding balance.
- Important clinical alerts.

Provide appropriate actions within each section.

## 9. DENTAL RECORDS

Route: `/dental-records`

Create a clinical records interface.

Include:
- Patient name.
- Patient ID.
- Visit date.
- Dental professional.
- Presenting complaint.
- Examination findings.
- Clinical assessment.
- Treatment performed.
- Follow-up instructions.

Provide search and filtering by patient, professional, and visit date.

Include an "Add Dental Record" modal or dedicated form.

The form should support:
- Patient selection.
- Visit date.
- Presenting complaint.
- Examination findings.
- Clinical notes.
- Teeth involved.
- Assessment.
- Treatment details.
- Follow-up date.
- Attachments as simulated local selections.

Allow the user to create, view, edit, and cancel a draft record.

Use clear visual distinctions between drafts and finalized demonstration records.

Clearly label all records as demonstration data.

## 10. INTERACTIVE DENTAL CHART

Build a visual dental chart as a reusable component.

It should display adult permanent teeth using a recognizable dental layout.

Support FDI numbering and provide an option to switch to the Universal Numbering System.

Use CSS or SVG to create a clean, recognizable chart.

Do not depend on externally hosted tooth images.

Features:
- Clickable teeth.
- Selected-tooth highlighting.
- Tooth numbering.
- Tooth condition indicators.
- Legend.
- Tooth-specific notes.
- Recorded procedure history.
- Ability to simulate adding a finding to a tooth.

When a user selects a tooth, open a side panel or modal with:
- Tooth number.
- Recorded condition.
- Notes.
- Previous procedures.
- Add finding action.

Allow selection of multiple teeth where appropriate.

Use the light-orange brand palette while maintaining clear distinctions between different tooth conditions.

The chart must work on desktop, tablet, and mobile.

## 11. APPOINTMENTS

Route: `/appointments`

Build a complete appointment management UI.

### Views

Provide:
- Calendar view.
- Week view.
- Day view.
- List view.

### Appointment information

Display:
- Patient.
- Date.
- Start time.
- End time.
- Appointment type.
- Assigned professional.
- Status.

Statuses:
- Scheduled.
- Confirmed.
- Checked In.
- In Progress.
- Completed.
- Cancelled.
- No-Show.

### Interactions

Implement:
- Schedule Appointment.
- Edit Appointment.
- Reschedule.
- Cancel Appointment.
- Mark as Checked In.
- Mark as Completed.
- Filter by professional.
- Filter by appointment status.
- Search by patient.

Build a scheduling modal with validated form fields.

Use mock working hours and detect overlapping appointments for the same professional.

Show clear success and error messages.

The calendar should use a clean layout and should not become cramped on smaller screens.

## 12. TREATMENT PLANS

Route: `/treatment-plans`

Create a treatment planning interface.

Include:
- Patient.
- Plan name.
- Date created.
- Responsible professional.
- Procedures.
- Teeth involved.
- Estimated cost.
- Priority.
- Status.

Statuses:
- Draft.
- Awaiting Review.
- Awaiting Patient Approval.
- Approved.
- In Progress.
- Completed.
- Cancelled.

Create a treatment plan details page or expandable detail view.

Allow users to:
- Create plans.
- Add procedures.
- Edit plans.
- Update statuses.
- Review estimated costs.
- View linked patient records.

Display a clear summary of the treatment plan and its constituent procedures.

## 13. DENTAL PROCEDURES

Route: `/procedures`

Create a searchable procedure catalog.

Include:
- Procedure name.
- Procedure code.
- Category.
- Description.
- Default price.
- Estimated duration.
- Status.

Example categories:
- Consultation.
- Examination.
- Preventive care.
- Restorations.
- Extractions.
- Crowns.
- Bridges.
- Dentures.
- Implants.
- Dental prosthetics.
- Repairs and adjustments.

Include:
- Search.
- Category filters.
- Add Procedure.
- Edit Procedure.
- Activate or deactivate procedure.
- Procedure detail view.

Use Nigerian naira (NGN) for demonstration prices.

Keep procedure information configurable because not every example necessarily represents a service offered by the business.

## 14. PRESCRIPTIONS

Route: `/prescriptions`

Create a prescription management interface.

Include:
- Prescription ID.
- Patient.
- Prescribing professional.
- Date.
- Number of medications.
- Status.

Build a prescription form containing:
- Patient.
- Prescribing professional.
- Medication name.
- Strength.
- Dosage instructions.
- Route.
- Frequency.
- Duration.
- Quantity.
- Additional instructions.

Allow users to:
- Create a demonstration prescription.
- View prescription details.
- Edit drafts.
- Preview a printable prescription.
- Print the prescription.

Do not automatically prescribe medication or generate medical recommendations.

Clearly distinguish demonstration records from actual prescriptions.

## 15. DENTAL LABORATORY

Routes:
- `/laboratory`
- `/laboratory/[id]`

This is one of the most important parts of the application.

Design a dedicated laboratory management interface tailored to dental prosthetics.

### Laboratory dashboard

Show summary cards:
- Total Active Orders.
- In Production.
- Awaiting Quality Control.
- Ready for Delivery.
- Overdue Orders.

### Laboratory order table

Columns:
- Order ID.
- Patient.
- Prosthetic Type.
- Assigned Technician.
- Date Received.
- Due Date.
- Status.
- Priority.
- Actions.

Include:
- Search.
- Filters.
- Sorting.
- Pagination.
- Add Laboratory Order.
- View Details.
- Edit Order.

### Order types

Include examples such as:
- Complete Denture.
- Partial Denture.
- Crown.
- Bridge.
- Implant-Supported Prosthetic.
- Removable Prosthetic.
- Repair.
- Adjustment.
- Other Custom Appliance.

### Laboratory order creation form

Include:
- Patient.
- Ordering professional or clinic.
- Work type.
- Teeth involved.
- Material.
- Shade.
- Impression or scan received.
- Production instructions.
- Assigned technician.
- Creation date.
- Due date.
- Estimated cost.
- Priority.
- Attachments.

### Production workflow

Create a visual workflow tracker:

1. Order Received.
2. Awaiting Impression or Scan.
3. Ready for Production.
4. In Production.
5. Quality Control.
6. Awaiting Adjustment.
7. Ready for Delivery.
8. Delivered.

Include Cancelled as a separate status.

Allow the user to advance an order through the workflow.

Update the interface immediately when a status changes.

### Laboratory order details

Display:
- Order summary.
- Patient information.
- Work specifications.
- Assigned technician.
- Current status.
- Due date.
- Production timeline.
- Technical notes.
- Quality-control results.
- Cost details.
- Attachments.
- Activity history.

Include a timeline showing every simulated status change.

Use orange indicators for active stages and red indicators for overdue orders.

## 16. BILLING AND PAYMENTS

Routes:
- `/billing`
- `/billing/[id]`

Build a professional billing interface.

### Summary cards

Show:
- Total Invoiced.
- Payments Received.
- Outstanding Balance.
- Overdue Invoices.

### Invoice table

Include:
- Invoice number.
- Patient.
- Issue date.
- Due date.
- Total.
- Amount paid.
- Balance.
- Status.

Statuses:
- Unpaid.
- Partially Paid.
- Paid.
- Overdue.
- Cancelled.

### Features

Implement:
- Create Invoice.
- Add invoice items.
- Calculate subtotal.
- Apply discounts.
- Calculate total.
- Record partial payment.
- View payment history.
- Generate printable invoice.
- Generate printable receipt.
- Search and filter invoices.

Use NGN as the default display currency.

Use reliable monetary calculations and avoid floating-point errors where practical.

All invoice and payment interactions must update local state consistently.

Clearly label the payment functionality as simulated.

Do not connect a real payment gateway.

## 17. REPORTS AND ANALYTICS

Route: `/reports`

Create a reporting dashboard with:
- Patient registrations.
- Appointment statistics.
- Appointment attendance.
- Procedure distribution.
- Laboratory workload.
- Laboratory turnaround.
- Revenue trends.
- Outstanding balances.

Include:
- Date-range selection.
- Chart visualizations.
- Summary cards.
- Data tables.
- CSV export using browser-side functionality.
- Print-friendly reports.

Charts should use the shared mock dataset.

Update chart views when filters change.

Clearly indicate when data is synthetic demonstration data.

## 18. STAFF AND USERS

Route: `/staff`

Create a staff management interface.

Display:
- Avatar.
- Staff name.
- Role.
- Email.
- Phone.
- Status.
- Join date.

Suggested roles:
- Administrator.
- Dentist.
- Dental Assistant.
- Laboratory Technician.
- Receptionist.
- Accountant.

Features:
- Search staff.
- Filter by role.
- Add staff member.
- Edit staff details.
- View profile.
- Activate or deactivate staff.

Because authentication and backend authorization are not part of this phase, simulate role selection and permissions visually.

Do not claim that the frontend role selector provides real security.

## 19. NOTIFICATIONS

Route: `/notifications`

Create a notification center.

Include notification types for:
- Upcoming appointments.
- Appointment changes.
- New laboratory orders.
- Overdue laboratory orders.
- Completed laboratory work.
- Outstanding invoices.
- Follow-up reminders.

Features:
- Mark as read.
- Mark all as read.
- Filter by category.
- View notification details.
- Clear visual unread indicators.

Persist read status in localStorage where appropriate.

## 20. SETTINGS

Route: `/settings`

Create a complete settings interface with tabs.

### General
- Business name.
- Logo.
- Contact information.
- Business address.
- Currency.
- Time zone.

### Appearance
- Primary brand color.
- Logo preview.
- Interface theme.
- Sidebar preferences.

Set the default primary color to #FFB366.

### Clinic preferences
- Working hours.
- Default appointment duration.
- Appointment types.
- Default calendar view.

### Laboratory
- Laboratory order numbering.
- Available work types.
- Default turnaround targets.
- Priority settings.

### Billing
- Invoice numbering.
- Default currency.
- Default payment terms.
- Receipt preferences.

### Notifications
- Appointment reminders.
- Laboratory alerts.
- Payment reminders.

Save editable settings in localStorage.

Changes to the business name or brand color should update the relevant parts of the interface immediately.

Do not imply that external notifications are sent.

## 21. GLOBAL SEARCH

Implement a functional global search interface.

Search across:
- Patients.
- Appointments.
- Dental records.
- Laboratory orders.
- Invoices.
- Procedures.

Display results grouped by category.

Allow clicking a result to navigate to its relevant page.

Include:
- Keyboard focus.
- Clear search action.
- Empty states.
- Loading or transition feedback.
- Search-result highlighting where appropriate.

Use the shared mock data as the search source.

## 22. MOCK DATA ARCHITECTURE

Create a well-organized mock data layer.

Suggested structure:

`src/lib/mock-data/`
- patients.ts
- appointments.ts
- dental-records.ts
- treatment-plans.ts
- procedures.ts
- prescriptions.ts
- laboratory-orders.ts
- invoices.ts
- staff.ts
- notifications.ts

Create shared TypeScript types.

Suggested structure:

`src/types/`
- patient.ts
- appointment.ts
- dental-record.ts
- treatment-plan.ts
- procedure.ts
- prescription.ts
- laboratory.ts
- billing.ts
- staff.ts
- notification.ts

Use a consistent data model across all pages.

For example, a laboratory order must reference the same patient record used by the Patients page.

An invoice should reference the appropriate patient.

An appointment should reference an existing patient and staff member.

Do not duplicate unrelated hardcoded records inside individual page components.

Create realistic fictional demonstration data with at least:
- 20 patients.
- 12 appointments.
- 10 dental records.
- 8 treatment plans.
- 15 procedures.
- 8 prescriptions.
- 15 laboratory orders.
- 12 invoices.
- 6 staff members.
- 15 notifications.

Generate IDs consistently.

Use fictional names and contact information.

Do not use real patient information.

## 23. INTERACTION REQUIREMENTS

The frontend must be genuinely interactive.

Implement:
- Navigation between all pages.
- Search and filtering.
- Sorting.
- Pagination.
- Modal dialogs.
- Form validation.
- Create and edit workflows.
- Confirmation dialogs.
- Toast notifications.
- Status updates.
- Tab switching.
- Dropdown menus.
- Responsive sidebars.
- Calendar navigation.
- Table row actions.
- Printable document previews.
- CSV exports.
- Local persistence.

Use React state and localStorage as appropriate.

When a user adds or edits a record, the relevant lists, detail views, dashboard statistics, and charts should reflect the change wherever practical.

Provide a reset-demo-data action in Settings so the original demonstration data can be restored.

Avoid buttons that do nothing.

If an action cannot be fully implemented in the frontend-only phase, show an informative message explaining that it will be available after backend integration.

## 24. COMPONENT ARCHITECTURE

Build reusable components.

Suggested structure:

`src/components/layout/`
- app-sidebar.tsx
- app-header.tsx
- mobile-navigation.tsx
- page-container.tsx
- page-header.tsx
- breadcrumb-navigation.tsx

`src/components/dashboard/`
- summary-card.tsx
- patient-registration-chart.tsx
- appointment-chart.tsx
- revenue-chart.tsx
- laboratory-overview.tsx
- recent-activity.tsx

`src/components/patients/`
- patient-table.tsx
- patient-form.tsx
- patient-profile-header.tsx
- patient-summary.tsx
- patient-tabs.tsx
- dental-chart.tsx

`src/components/appointments/`
- appointment-calendar.tsx
- appointment-table.tsx
- appointment-form.tsx

`src/components/laboratory/`
- laboratory-table.tsx
- laboratory-form.tsx
- laboratory-status-tracker.tsx
- laboratory-order-details.tsx

`src/components/billing/`
- invoice-table.tsx
- invoice-form.tsx
- invoice-preview.tsx
- payment-dialog.tsx

`src/components/shared/`
- data-table.tsx
- status-badge.tsx
- search-input.tsx
- filter-toolbar.tsx
- empty-state.tsx
- loading-state.tsx
- confirmation-dialog.tsx
- section-card.tsx

Adapt the structure as needed, but maintain separation between reusable components, page layouts, types, and mock data.

## 25. RESPONSIVE DESIGN

The entire application must work on:
- Desktop.
- Laptop.
- Tablet.
- Mobile.

Desktop:
- Full sidebar.
- Multi-column dashboard.
- Full data tables.

Tablet:
- Collapsible sidebar.
- Adaptive card layouts.
- Scrollable or responsive tables.

Mobile:
- Slide-out navigation.
- Single-column cards.
- Mobile-friendly forms.
- Accessible dialogs.
- Responsive patient profiles.
- Horizontally scrollable data tables where necessary.

Avoid horizontal overflow across the entire application.

Ensure buttons, fields, and interactive elements are usable with touch input.

## 26. ACCESSIBILITY AND FINISHING DETAILS

Implement:
- Semantic HTML.
- Accessible form labels.
- Keyboard navigation.
- Visible focus states.
- Accessible modal behavior.
- Sufficient color contrast.
- Clear validation messages.
- Meaningful empty states.
- Consistent loading indicators.
- Helpful error messages.

Use subtle animations only where they improve usability.

Ensure the interface does not rely on color alone to communicate status.

Make the application look cohesive across every route.

## 27. FRONTEND DIRECTORY STRUCTURE

Use a structure similar to:

`src/app/`
- `(dashboard)/dashboard/page.tsx`
- `(dashboard)/patients/page.tsx`
- `(dashboard)/patients/[id]/page.tsx`
- `(dashboard)/appointments/page.tsx`
- `(dashboard)/dental-records/page.tsx`
- `(dashboard)/treatment-plans/page.tsx`
- `(dashboard)/procedures/page.tsx`
- `(dashboard)/prescriptions/page.tsx`
- `(dashboard)/laboratory/page.tsx`
- `(dashboard)/laboratory/[id]/page.tsx`
- `(dashboard)/billing/page.tsx`
- `(dashboard)/billing/[id]/page.tsx`
- `(dashboard)/reports/page.tsx`
- `(dashboard)/staff/page.tsx`
- `(dashboard)/notifications/page.tsx`
- `(dashboard)/settings/page.tsx`

Also include:
- Shared layouts.
- Global CSS.
- Shared design tokens.
- Reusable components.
- Types.
- Mock data.
- Utility functions.
- Form schemas.

Use the current stable Next.js App Router conventions and ensure all routes resolve correctly.

## 28. DEVELOPMENT WORKFLOW

Follow these phases.

### Phase 1: Project setup and design system
- Inspect the existing files.
- Configure Next.js and TypeScript.
- Configure Tailwind CSS.
- Install compatible dependencies.
- Configure shadcn/ui.
- Define the light-orange design system.
- Create the application shell.
- Build the sidebar and header.
- Create reusable components.

### Phase 2: Core dashboard
- Create mock data.
- Build summary cards.
- Build charts.
- Build recent activity.
- Build appointment widgets.
- Build laboratory widgets.

### Phase 3: Patients and clinical interfaces
- Patient list.
- Patient registration form.
- Patient profile.
- Dental records.
- Interactive dental chart.
- Treatment plans.

### Phase 4: Operations
- Appointments.
- Procedures.
- Prescriptions.
- Laboratory management.
- Laboratory order details.

### Phase 5: Administration
- Billing.
- Invoice details.
- Reports.
- Staff.
- Notifications.
- Settings.

### Phase 6: Interactions and quality
- Connect all mock data.
- Implement local persistence.
- Add validation.
- Add filters and pagination.
- Verify every button.
- Test every route.
- Check responsiveness.
- Fix TypeScript and lint errors.

## 29. IMPORTANT IMPLEMENTATION RULES

1. Inspect the existing codebase before making changes.
2. If a Next.js project already exists, preserve working functionality and build on it.
3. Do not unnecessarily recreate the project.
4. Do not stop after generating a plan.
5. Do not build only the dashboard while ignoring the other pages.
6. Do not create empty placeholder pages for required modules.
7. Do not implement a backend in this phase.
8. Do not connect a database.
9. Do not introduce Supabase or other backend services.
10. Use realistic, centralized mock data.
11. Keep all primary interactions functional.
12. Use consistent colors, typography, spacing, and components.
13. Ensure the entire interface is responsive.
14. Fix all build errors before declaring completion.
15. Never claim to have tested something that has not actually been tested.
16. Clearly identify any incomplete functionality.

## 30. FINAL ACCEPTANCE CRITERIA

The frontend is complete when:

- Every specified route works.
- The entire application uses the NeonDentalProstectics brand identity.
- Light orange is the primary accent color.
- The interface looks professional and visually consistent.
- Every major module has a fully designed page.
- All major forms have validation.
- Search, filters, and pagination work.
- The dental chart is interactive.
- Appointment management interactions work.
- Laboratory order tracking works.
- Invoice calculations and simulated payments work.
- Dashboard statistics reflect the shared mock data.
- User actions update the interface immediately.
- Local persistence works where appropriate.
- Responsive layouts work across screen sizes.
- There are no broken navigation links.
- There are no major console errors.
- There are no TypeScript or build errors.
- The project can be started using documented commands.

## YOUR FIRST ACTION

Start by inspecting the existing project files and current development environment.

If a project already exists, work within it.

If no project exists, initialize Next.js with TypeScript, Tailwind CSS, and the App Router.

Then implement the application shell and design system before moving through the remaining phases.

Build the actual frontend, not just a specification.

Prioritize excellent UI quality, coherent navigation, consistent mock data, and working interactions.

**The goal is a complete, beautiful, interactive, frontend-only dental management application for NeonDentalProstectics, built with Next.js and a premium light-orange design system. Backend development will happen in a separate phase after the entire UI is complete.**