import type { Row, Database } from "@/types";
export type { Row, Database } from "@/types";
export const today = () => new Date().toLocaleDateString("en-CA");
export const workflow = [
  "Order Received",
  "Awaiting Impression or Scan",
  "Ready for Production",
  "In Production",
  "Quality Control",
  "Awaiting Adjustment",
  "Ready for Delivery",
  "Delivered",
];
export const modules = [
  ["dashboard", "Dashboard"],
  ["patients", "Patients"],
  ["appointments", "Appointments"],
  ["dental-records", "Dental Records"],
  ["treatment-plans", "Treatment Plans"],
  ["procedures", "Dental Procedures"],
  ["prescriptions", "Prescriptions"],
  ["laboratory", "Dental Laboratory"],
  ["billing", "Billing & Payments"],
  ["reports", "Reports & Analytics"],
  ["staff", "Staff & Users"],
  ["notifications", "Notifications"],
  ["settings", "Settings"],
];
const names = [
  "Amara Okafor",
  "Tunde Adeyemi",
  "Chidinma Obi",
  "Ibrahim Musa",
  "Zainab Bello",
  "Emeka Nwosu",
  "Adaeze Eze",
  "Samuel Johnson",
  "Fatima Ibrahim",
  "Daniel Adebayo",
  "Grace Uche",
  "Oluwaseun Ojo",
  "Aisha Mohammed",
  "Chukwuemeka Onuoha",
  "Blessing Edet",
  "David Akpan",
  "Maryam Yusuf",
  "Chisom Nnamdi",
  "Peter Okeke",
  "Ngozi Opara",
  "Sarah James",
  "Joseph Dada",
  "Ruth Williams",
  "Musa Abdullahi",
];
const proc = [
  "Consultation",
  "Comprehensive examination",
  "Scale & polish",
  "Composite restoration",
  "Simple extraction",
  "Zirconia crown",
  "Three-unit bridge",
  "Complete denture",
  "Partial denture",
  "Implant restoration",
  "Denture repair",
  "Bite adjustment",
  "Fluoride treatment",
  "Digital impression",
  "Prosthetic review",
];
const prices = [
  10000, 15000, 25000, 35000, 30000, 150000, 350000, 250000, 175000, 450000,
  45000, 20000, 15000, 30000, 10000,
];
const pad = (n: number) => String(n + 1).padStart(4, "0");
function dateAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("en-CA");
}
export function seed(): Database {
  const patients = names.map((name, i) => ({
    id: `PAT-${pad(i)}`,
    name,
    status: i === 9 ? "Archived" : i % 6 === 0 ? "Follow-up" : "Active",
    date: dateAgo(i * 6),
    dob: `${1980 + (i % 20)}-0${1 + (i % 9)}-15`,
    phone: `0800 000 ${pad(i)}`,
    email: `patient${i + 1}@example.com`,
    address: "12 Example Close, Lagos",
    allergies: i % 5 === 0 ? "Latex" : "None recorded",
    history: "Fictional patient. Routine oral care.",
    notes: "Demonstration data only.",
  }));
  const staff = [
    "Dr. Gifted",
    "Dr. Femi Oladipo",
    "Chioma Eze",
    "Daniel Peters",
    "Kemi Adesina",
    "James Okon",
  ].map((name, i) => ({
    id: `STF-${pad(i)}`,
    name,
    status: "Active",
    date: dateAgo(100 + i * 20),
    role: [
      "Dentist",
      "Dentist",
      "Dental Assistant",
      "Laboratory Technician",
      "Receptionist",
      "Accountant",
    ][i],
    email: `staff${i + 1}@example.com`,
    phone: `0800 100 ${pad(i)}`,
  }));
  const procedures = proc.map((name, i) => ({
    id: `PRC-${pad(i)}`,
    name,
    status: "Active",
    date: dateAgo(i),
    category: [
      "Consultation",
      "Examination",
      "Preventive care",
      "Restorations",
      "Extractions",
      "Crowns",
      "Bridges",
      "Dentures",
      "Dentures",
      "Implants",
      "Repairs and adjustments",
      "Repairs and adjustments",
      "Preventive care",
      "Dental prosthetics",
      "Consultation",
    ][i],
    price: prices[i],
    duration: 30 + (i % 4) * 15,
    description: `Configurable demonstration service: ${name.toLowerCase()}.`,
  }));
  const base = (prefix: string, n: number, fn: (i: number) => Partial<Row>) =>
    Array.from({ length: n }, (_, i) => ({
      id: `${prefix}-${pad(i)}`,
      name: "",
      status: "Active",
      date: dateAgo(i * 2),
      patient: patients[i % 24].id,
      professional: staff[i % 2].id,
      ...fn(i),
    }));
  return {
    patients,
    staff,
    procedures,
    appointments: base("APT", 18, (i) => ({
      name: proc[i % 15],
      date: dateAgo(i < 8 ? 0 : i - 7),
      time: `${String(9 + Math.floor(i % 8)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
      duration: 30,
      status: [
        "Confirmed",
        "Checked In",
        "Completed",
        "Scheduled",
        "Cancelled",
      ][i % 5],
    })),
    "dental-records": base("REC", 10, (i) => ({
      name: [
        "Routine review",
        "Prosthetic assessment",
        "Restorative follow-up",
      ][i % 3],
      status: i % 3 === 0 ? "Draft" : "Finalized",
      complaint: "Review of comfort and function",
      findings: "Demonstration examination findings",
      assessment: "Clinical review recorded for demonstration",
      treatment: "Consultation and hygiene discussion",
      teeth: "16, 26",
      followup: dateAgo(-14),
      notes: "Fictional clinical record; not medical advice.",
    })),
    "treatment-plans": base("TPL", 8, (i) => ({
      name: [
        "Upper arch rehabilitation",
        "Restorative care plan",
        "Denture replacement",
        "Preventive care",
      ][i % 4],
      status: [
        "Draft",
        "Awaiting Review",
        "Awaiting Patient Approval",
        "Approved",
        "In Progress",
        "Completed",
        "Cancelled",
      ][i % 7],
      priority: i % 3 === 0 ? "High" : "Normal",
      procedures: [procedures[i].id, procedures[(i + 2) % 15].id],
      teeth: "16, 26",
      price: prices[i] + prices[(i + 2) % 15],
      notes: "Review procedures and obtain patient approval.",
    })),
    prescriptions: base("RX", 8, (i) => ({
      name: "Demonstration prescription",
      status: "Draft",
      medication: "Sample medication (fictional)",
      strength: "For demonstration only",
      dosage: "Entered by prescribing professional",
      route: "Oral",
      frequency: "As entered",
      duration: "As entered",
      quantity: 1,
      notes: "DEMONSTRATION ONLY — NOT VALID FOR DISPENSING.",
    })),
    laboratory: base("LAB", 15, (i) => ({
      date: dateAgo(10 + i),
      name: [
        "Zirconia crown",
        "Complete denture",
        "Partial denture",
        "Three-unit bridge",
        "Denture repair",
      ][i % 5],
      status: workflow[i % 8],
      technician: staff[3].id,
      due: dateAgo(3 - i),
      material: ["Zirconia", "Acrylic", "Cobalt chrome"][i % 3],
      shade: ["A1", "A2", "B1"][i % 3],
      teeth: ["16", "11–17", "36, 37"][i % 3],
      priority: i % 4 === 0 ? "High" : "Normal",
      price: prices[(i + 5) % 15],
      impression: "Digital scan received",
      notes: "Check fit, finish, and occlusal clearance.",
      history: [`${dateAgo(i * 2)} · Order Received`],
    })),
    billing: base("INV", 12, (i) => ({
      name: `Invoice ${pad(i)}`,
      status: i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Partially Paid" : "Unpaid",
      due: dateAgo(i - 7),
      items: [procedures[i % 15].id, procedures[(i + 2) % 15].id],
      itemPrices: [String(prices[i % 15]), String(prices[(i + 2) % 15])],
      subtotal: prices[i % 15] + prices[(i + 2) % 15],
      discount: 0,
      total: prices[i % 15] + prices[(i + 2) % 15],
      paid:
        i % 3 === 0
          ? prices[i % 15] + prices[(i + 2) % 15]
          : i % 3 === 1
            ? 5000
            : 0,
      payments:
        i % 3 === 2
          ? []
          : [
              `${dateAgo(i * 2)} · ₦${i % 3 === 0 ? prices[i % 15] + prices[(i + 2) % 15] : 5000} · Demo payment`,
            ],
    })),
    notifications: base("NTF", 15, (i) => ({
      name: [
        "Upcoming appointment",
        "Laboratory order ready",
        "Invoice follow-up",
        "Patient recall reminder",
        "Appointment changed",
      ][i % 5],
      status: i < 5 ? "Unread" : "Read",
      category: [
        "Appointments",
        "Laboratory",
        "Billing",
        "Follow-up",
        "Appointments",
      ][i % 5],
      notes: "Review the linked demonstration record for details.",
    })),
    findings: [],
    activity: [],
  };
}
export const currency = (n: number, c = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: c,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
export const amount = (r: Row, k: string) => Number(r[k] || 0);
export function invoiceStatus(r: Row) {
  return r.status === "Cancelled"
    ? "Cancelled"
    : amount(r, "paid") >= amount(r, "total")
      ? "Paid"
      : String(r.due) < today()
        ? "Overdue"
        : amount(r, "paid") > 0
          ? "Partially Paid"
          : "Unpaid";
}
export const statuses: Record<string, string[]> = {
  patients: ["Active", "Follow-up", "Archived"],
  appointments: [
    "Scheduled",
    "Confirmed",
    "Checked In",
    "Completed",
    "Cancelled",
    "No Show",
  ],
  "dental-records": ["Draft", "Finalized", "Cancelled"],
  "treatment-plans": [
    "Draft",
    "Awaiting Review",
    "Awaiting Patient Approval",
    "Approved",
    "In Progress",
    "Completed",
    "Cancelled",
  ],
  procedures: ["Active", "Inactive"],
  prescriptions: ["Draft", "Issued", "Cancelled"],
  laboratory: [...workflow, "Cancelled"],
  billing: ["Unpaid", "Partially Paid", "Paid", "Overdue", "Cancelled"],
  staff: ["Active", "Inactive"],
  notifications: ["Unread", "Read"],
};
