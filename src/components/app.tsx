"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Download,
  Ellipsis,
  FileHeart,
  FlaskConical,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users,
  X,
  Printer,
  LogOut,
  Command,
  HeartPulse,
  Clock,
  Wallet,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  seed,
  Row,
  Database,
  modules,
  workflow,
  statuses,
  currency,
  amount,
  today,
  invoiceStatus,
} from "@/lib/data";
const icons = [
  LayoutDashboard,
  Users,
  CalendarDays,
  FileHeart,
  ClipboardList,
  Stethoscope,
  HeartPulse,
  FlaskConical,
  CreditCard,
  TrendingUp,
  Users,
  Bell,
  Settings,
];
const descriptions: Record<string, string> = {
  patients: "Every patient, a connected story of care.",
  appointments: "Make room for better care. Keep your day in sync.",
  "dental-records": "A clear, connected view of every clinical encounter.",
  "treatment-plans": "Thoughtful plans. Confident next steps.",
  procedures: "Your services, carefully organized.",
  prescriptions: "Manage and preview fictional demonstration prescriptions.",
  laboratory: "From first impression to the perfect fit.",
  billing: "A healthier view of your practice finances.",
  reports: "Turn your practice activity into a clearer picture.",
  staff: "The people behind exceptional care.",
  notifications: "The updates that keep your practice moving.",
  settings: "Make this workspace feel like your practice.",
};
const createLabels: Record<string, string> = {
  patients: "Register Patient",
  appointments: "Schedule Appointment",
  "dental-records": "Add Dental Record",
  "treatment-plans": "Create Treatment Plan",
  procedures: "Add Procedure",
  prescriptions: "Create Prescription",
  laboratory: "New Laboratory Order",
  billing: "Create Invoice",
  staff: "Add Staff Member",
};
const initials = (s: string) =>
  s
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("");
const str = (v: unknown) => String(v ?? "");
function Badge({ value }: { value: string }) {
  return (
    <span
      className={
        "badge " +
        (/Paid|Completed|Active|Finalized|Delivered|Ready for Delivery|Confirmed|Approved|Read$/.test(
          value,
        ) && !value.includes("Unread")
          ? "green"
          : /Overdue|Cancelled|High|Archived|No Show/.test(value)
            ? "red"
            : /Draft|Inactive|Scheduled/.test(value)
              ? "gray"
              : "orange")
      }
    >
      <i />
      {value}
    </span>
  );
}
function Avatar({ name, small = false }: { name: string; small?: boolean }) {
  return (
    <span className={"avatar " + (small ? "small" : "")}>{initials(name)}</span>
  );
}
function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="modal">
          <div className="modal-head">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Description>
                {description ||
                  "Fictional demonstration data · Changes are stored in this browser."}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="icon-button" aria-label="Close">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
function MenuDrop({ children }: { children: React.ReactNode }) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button className="icon-button" aria-label="More actions">
          <Ellipsis size={18} />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content className="dropdown" sideOffset={6}>
          {children}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
function Action({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Dropdown.Item className="dropdown-item" onSelect={onClick}>
      {children}
    </Dropdown.Item>
  );
}
const defaultSettings: Record<string, string> = {
  business: "NeonDentalProstectics",
  color: "#FFB366",
  currency: "NGN",
  theme: "Light",
  duration: "30",
  working: "09:00–17:00",
  timezone: "Africa/Lagos",
  email: "hello@example.com",
  phone: "0800 000 0000",
  address: "Enugu, Nigeria",
  sidebar: "Expanded",
  calendar: "Week",
  orderPrefix: "LAB",
  invoicePrefix: "INV",
  turnaround: "7",
  terms: "14 days",
  appointmentTypes: "Consultation, Review, Treatment",
  workTypes: "Crown, Bridge, Denture",
  priority: "Normal",
  reminders: "Enabled (demo)",
  labAlerts: "Enabled (demo)",
  paymentAlerts: "Enabled (demo)",
  receipt: "Printable preview",
};

export default function App() {
  const path = usePathname(),
    router = useRouter();
  const parts = path.split("/").filter(Boolean),
    section = parts[0] || "dashboard",
    detailId = parts[1];
  const [db, setDb] = useState<Database>(() => seed()),
    [ready, setReady] = useState(false),
    [settings, setSettings] = useState<Record<string, string>>(defaultSettings);
  const [collapsed, setCollapsed] = useState(false),
    [mobile, setMobile] = useState(false),
    [searchOpen, setSearchOpen] = useState(false),
    [globalSearch, setGlobalSearch] = useState(""),
    [editor, setEditor] = useState<{
      module: string;
      row?: Row;
      patient?: string;
    } | null>(null),
    [view, setView] = useState<{ module: string; row: Row } | null>(null),
    [toast, setToast] = useState(""),
    [signedOut, setSignedOut] = useState(false),
    [confirm, setConfirm] = useState<{
      text: string;
      action: () => void;
    } | null>(null);
  useEffect(() => {
    try {
      const d = localStorage.getItem("neondental-v1");
      if (d) {
        const stored = JSON.parse(d);
        if (Array.isArray(stored.staff)) {
          stored.staff = stored.staff.map((person: Row) =>
            person.name === "Dr. Ada Williams"
              ? { ...person, name: "Dr. Gifted" }
              : person,
          );
        }
        const defaults = seed();
        setDb(
          Object.fromEntries(
            Object.keys(defaults).map((k) => [
              k,
              Array.isArray(stored[k]) ? stored[k] : defaults[k],
            ]),
          ),
        );
      }
      const s = localStorage.getItem("neondental-settings");
      if (s) {
        const storedSettings = JSON.parse(s);
        if (storedSettings.address === "12 Example Street, Lagos") {
          storedSettings.address = defaultSettings.address;
        }
        setSettings({ ...defaultSettings, ...storedSettings });
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("neondental-v1", JSON.stringify(db));
        localStorage.setItem("neondental-settings", JSON.stringify(settings));
      } catch {
        setToast(
          "Browser storage is full. Changes will last for this session.",
        );
      }
    }
  }, [db, settings, ready]);
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", settings.color);
    setCollapsed(settings.sidebar === "Collapsed");
  }, [settings.color, settings.sidebar]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 4500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    setMobile(false);
    setView(null);
  }, [path]);
  const patientName = (id: unknown) =>
    db.patients.find((p) => p.id === id)?.name || "Unlinked patient";
  const staffName = (id: unknown) =>
    db.staff.find((p) => p.id === id)?.name || "Unassigned";
  const money = (n: number) => currency(n, settings.currency);
  function save(mod: string, row: Row) {
    setDb((d) => ({
      ...d,
      [mod]: d[mod].some((r) => r.id === row.id)
        ? d[mod].map((r) => (r.id === row.id ? row : r))
        : [row, ...d[mod]],
      activity: [
        {
          id: crypto.randomUUID(),
          name: `${row.name} updated`,
          status: "Recorded",
          date: today(),
          patient: mod === "patients" ? row.id : row.patient,
        },
        ...d.activity,
      ].slice(0, 100),
    }));
    setToast("Saved to your demonstration workspace.");
    setEditor(null);
  }
  function update(mod: string, row: Row, status: string) {
    save(mod, {
      ...row,
      status,
      ...(mod === "laboratory"
        ? {
            history: [
              ...((row.history as string[]) || []),
              `${today()} · ${status}`,
            ],
          }
        : {}),
    });
  }
  function openRow(mod: string, row: Row) {
    if (["patients", "laboratory", "billing"].includes(mod))
      router.push(`/${mod}/${row.id}`);
    else setView({ module: mod, row });
  }
  const overdue = db.laboratory.filter(
    (r) =>
      str(r.due) < today() && !["Delivered", "Cancelled"].includes(r.status),
  );
  const unread = db.notifications.filter((r) => r.status === "Unread").length;
  const totalBalance = db.billing
    .filter((r) => r.status !== "Cancelled")
    .reduce(
      (s, r) => s + Math.max(0, amount(r, "total") - amount(r, "paid")),
      0,
    );
  const context = {
    settings,
    db,
    save,
    update,
    patientName,
    staffName,
    money,
    openRow,
    edit: (mod: string, row?: Row, patient?: string) =>
      setEditor({ module: mod, row, patient }),
    notify: setToast,
    confirm: (text: string, action: () => void) => setConfirm({ text, action }),
  };
  const title = modules.find((m) => m[0] === section)?.[1] || "Page not found";
  if (!ready)
    return (
      <div className="welcome" role="status">
        <div className="brand-mark">
          <Smile />
        </div>
        <p>Opening your practice workspace…</p>
      </div>
    );
  if (signedOut)
    return (
      <div className="welcome">
        <div className="brand-mark">
          <Smile />
        </div>
        <h1>Your practice, beautifully connected.</h1>
        <p>NeonDentalProstectics demonstration workspace</p>
        <Button onClick={() => setSignedOut(false)}>
          Enter demo workspace <ArrowRight size={16} />
        </Button>
      </div>
    );
  return (
    <div
      className={
        "app " +
        (collapsed ? "collapsed " : "") +
        (mobile ? "mobile-open " : "") +
        (settings.theme === "Dark" ? "dark" : "")
      }
    >
      <div className="mobile-scrim" onClick={() => setMobile(false)} />
      <aside className="sidebar">
        <Link href="/dashboard" className="brand">
          <div className="brand-mark">
            {settings.logo ? (
              <img src={settings.logo} alt="Practice logo" />
            ) : (
              <Smile size={28} />
            )}
          </div>
          <div>
            <strong>{settings.business}</strong>
            <span>DENTAL CARE WORKSPACE</span>
          </div>
        </Link>
        <div className="workspace-select">
          <span className="workspace-icon">N</span>
          <div>
            <b>Main practice</b>
            <small>Enugu, Nigeria</small>
          </div>
          <ChevronDown size={15} />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {modules.map(([slug, label], i) => {
            const Icon = icons[i];
            return (
              <React.Fragment key={slug}>
                {slug === "staff" && (
                  <div className="nav-label administration">ADMINISTRATION</div>
                )}
                <Link
                  className={section === slug ? "nav-item active" : "nav-item"}
                  href={"/" + slug}
                  title={label}
                >
                  <Icon size={19} />
                  <span>{label}</span>
                  {slug === "notifications" && unread > 0 && <em>{unread}</em>}
                </Link>
              </React.Fragment>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="care-card">
            <ShieldCheck size={22} />
            <b>Thoughtful care starts here</b>
            <p>
              Your entire practice.
              <br />
              One connected workspace.
            </p>
            <span>
              FRONTEND DEMO <i />
            </span>
          </div>
          <button
            className="user-card"
            onClick={() => router.push("/settings")}
          >
            <Avatar name="Gifted" small />
            <div>
              <b>Dr. Gifted</b>
              <small>{settings.demoRole || "Practice administrator"}</small>
            </div>
            <ChevronDown size={15} />
          </button>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="top-left">
            <button
              className="icon-button desktop-toggle"
              onClick={() => setCollapsed(!collapsed)}
              aria-label="Toggle sidebar"
            >
              <PanelLeftClose size={19} />
            </button>
            <button
              className="icon-button mobile-toggle"
              onClick={() => setMobile(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <span className="breadcrumb">
              Workspace <ChevronRight size={14} /> <b>{title}</b>
              {detailId && (
                <>
                  <ChevronRight size={14} />
                  <b>{detailId}</b>
                </>
              )}
            </span>
          </div>
          <div className="top-actions">
            <button
              className="search-trigger"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={17} />
              <span>Search anything...</span>
              <kbd>⌘ K</kbd>
            </button>
            <span className="top-divider" />
            <Link
              className="icon-button notification-bell"
              href="/notifications"
              aria-label={`${unread} unread notifications`}
            >
              <Bell size={19} />
              {unread > 0 && <i />}
            </Link>
            <Dropdown.Root>
              <Dropdown.Trigger asChild>
                <button
                  className="profile-trigger"
                  aria-label="Open profile menu"
                >
                  <Avatar name="Gifted" small />
                  <ChevronDown size={14} />
                </button>
              </Dropdown.Trigger>
              <Dropdown.Portal>
                <Dropdown.Content className="dropdown">
                  <Action
                    onClick={() => {
                      router.push("/staff");
                      setView({ module: "staff", row: db.staff[0] });
                    }}
                  >
                    My profile
                  </Action>
                  <Action onClick={() => router.push("/settings")}>
                    Preferences
                  </Action>
                  <Action onClick={() => setSignedOut(true)}>
                    Sign out of demo
                  </Action>
                </Dropdown.Content>
              </Dropdown.Portal>
            </Dropdown.Root>
          </div>
        </header>
        <main>
          <div className="demo-label">
            <span />
            <span>DEMO WORKSPACE</span>
            <span className="demo-note">
              Fictional data. Thoughtfully connected.
            </span>
          </div>
          {section === "dashboard" ? (
            <Dashboard
              {...context}
              totalBalance={totalBalance}
              overdue={overdue.length}
            />
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">YOUR PRACTICE, CONNECTED</div>
                  <h1>
                    {detailId &&
                    ["patients", "laboratory", "billing"].includes(section)
                      ? db[section]?.find((r) => r.id === detailId)?.name ||
                        "Record not found"
                      : title}
                  </h1>
                  <p>{descriptions[section]}</p>
                </div>
                {createLabels[section] && !detailId && (
                  <Button onClick={() => setEditor({ module: section })}>
                    <Plus size={17} />
                    {createLabels[section]}
                  </Button>
                )}
              </div>
              {detailId &&
              ["patients", "laboratory", "billing"].includes(section) ? (
                <Detail {...context} section={section} id={detailId} />
              ) : section === "reports" ? (
                <Reports {...context} />
              ) : section === "settings" ? (
                <SettingsPage
                  values={settings}
                  onSave={(v) => {
                    setSettings(v);
                    setToast("Practice preferences saved.");
                  }}
                  onReset={() =>
                    setConfirm({
                      text: "Reset all demonstration data and settings? This removes your local changes.",
                      action: () => {
                        setDb(seed());
                        setSettings({ ...defaultSettings });
                        setToast("Original demonstration data restored.");
                      },
                    })
                  }
                />
              ) : section === "notifications" ? (
                <Notifications {...context} />
              ) : db[section] ? (
                <ModulePage key={section} {...context} section={section} />
              ) : (
                <div className="empty">
                  <Smile />
                  <h2>This page does not exist.</h2>
                  <Link href="/dashboard">Return to dashboard</Link>
                </div>
              )}
            </>
          )}
          <footer>
            <span>
              © {new Date().getFullYear()} {settings.business}
            </span>
            <span>
              <i /> Frontend demonstration · Stored on this device
            </span>
          </footer>
        </main>
      </div>
      {editor && (
        <Editor
          {...context}
          module={editor.module}
          row={editor.row}
          patient={editor.patient}
          onClose={() => setEditor(null)}
        />
      )}
      <Modal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Search your practice"
        description="Find patients, appointments, records, orders, invoices and procedures."
      >
        <div className="global-input">
          <Search size={21} />
          <input
            autoFocus
            placeholder="Type a name, record ID, or procedure..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
          {globalSearch && (
            <button
              className="icon-button"
              onClick={() => setGlobalSearch("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="search-results">
          {globalSearch.trim() ? (
            (() => {
              let count = 0;
              const groups = [
                "patients",
                "appointments",
                "dental-records",
                "laboratory",
                "billing",
                "procedures",
              ].map((mod) => {
                const rows = db[mod]
                  .filter((r) =>
                    (r.id + " " + r.name + " " + patientName(r.patient))
                      .toLowerCase()
                      .includes(globalSearch.toLowerCase()),
                  )
                  .slice(0, 5);
                count += rows.length;
                return rows.length ? (
                  <div key={mod}>
                    <div className="nav-label">
                      {modules.find((m) => m[0] === mod)?.[1]}
                    </div>
                    {rows.map((r) => (
                      <button
                        className="search-result"
                        key={r.id}
                        onClick={() => {
                          setSearchOpen(false);
                          setGlobalSearch("");
                          if (
                            ["patients", "laboratory", "billing"].includes(mod)
                          )
                            router.push(`/${mod}/${r.id}`);
                          else {
                            router.push("/" + mod);
                            setTimeout(
                              () => setView({ module: mod, row: r }),
                              100,
                            );
                          }
                        }}
                      >
                        <div>
                          <b>{r.name}</b>
                          <small>
                            {r.id} {r.patient && "· " + patientName(r.patient)}
                          </small>
                        </div>
                        <ArrowRight size={16} />
                      </button>
                    ))}
                  </div>
                ) : null;
              });
              return count ? (
                groups
              ) : (
                <div className="empty">No records match “{globalSearch}”.</div>
              );
            })()
          ) : (
            <div className="empty">
              <Command />
              <p>Your whole practice is a search away.</p>
            </div>
          )}
        </div>
      </Modal>
      {view && (
        <RecordView
          {...context}
          module={view.module}
          row={db[view.module].find((r) => r.id === view.row.id) || view.row}
          onClose={() => setView(null)}
        />
      )}
      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="Confirm this change"
      >
        <p className="confirm-text">{confirm?.text}</p>
        <div className="modal-actions">
          <Button variant="outline" onClick={() => setConfirm(null)}>
            Keep current data
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              confirm?.action();
              setConfirm(null);
            }}
          >
            Confirm change
          </Button>
        </div>
      </Modal>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} />
          {toast}
          <button aria-label="Dismiss" onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
type Ctx = {
  settings: Record<string, string>;
  db: Database;
  save: (m: string, r: Row) => void;
  update: (m: string, r: Row, s: string) => void;
  patientName: (id: unknown) => string;
  staffName: (id: unknown) => string;
  money: (n: number) => string;
  openRow: (m: string, r: Row) => void;
  edit: (m: string, r?: Row, p?: string) => void;
  notify: (s: string) => void;
  confirm: (s: string, a: () => void) => void;
};
function Stat({
  label,
  value,
  note,
  icon: Icon = Users,
  trend,
}: {
  label: string;
  value: string | number;
  note: string;
  icon?: typeof Users;
  trend?: string;
}) {
  return (
    <div className="stat">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">
          <Icon size={19} />
        </span>
      </div>
      <strong>{value}</strong>
      <div className="stat-note">
        {trend && (
          <span className="trend">
            <ArrowUpRight size={13} />
            {trend}
          </span>
        )}
        {note}
      </div>
    </div>
  );
}
function Card({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={"card " + className}>
      <div className="card-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
function TrendChart({
  data,
  bar = false,
}: {
  data: { name: string; value: number }[];
  bar?: boolean;
}) {
  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        {bar ? (
          <BarChart
            data={data}
            margin={{ left: 0, right: 15, top: 15, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 5"
              vertical={false}
              stroke="#eee9e3"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9b928a" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9b928a" }}
              width={42}
            />
            <Tooltip cursor={{ fill: "#fff7f0" }} />
            <Bar
              dataKey="value"
              name="Total"
              fill="var(--primary)"
              radius={[5, 5, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        ) : (
          <AreaChart
            data={data}
            margin={{ left: 0, right: 15, top: 15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="orange" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 5"
              vertical={false}
              stroke="#eee9e3"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9b928a" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9b928a" }}
              width={34}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              name="Patients"
              stroke="var(--primary)"
              strokeWidth={2.5}
              fill="url(#orange)"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
function monthly(rows: Row[], value: (r: Row) => number = () => 1) {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - 5 + i);
    const key = d.toLocaleDateString("en-CA").slice(0, 7);
    return {
      name: d.toLocaleDateString("en", { month: "short" }),
      value: rows
        .filter((r) => r.date.startsWith(key))
        .reduce((s, r) => s + value(r), 0),
    };
  });
}
function Dashboard(c: Ctx & { totalBalance: number; overdue: number }) {
  const { db, patientName, staffName, edit, money } = c;
  const appointments = db.appointments
    .filter((r) => r.date === today())
    .sort((a, b) => str(a.time).localeCompare(str(b.time)));
  const [range, setRange] = useState("6");
  const registration = monthly(db.patients).slice(-Number(range));
  const activeLab = db.laboratory.filter(
    (r) => !["Delivered", "Cancelled"].includes(r.status),
  );
  return (
    <>
      <div className="page-heading dashboard-heading">
        <div>
          <div className="eyebrow">
            <span className="sun">☀</span> A GOOD DAY TO MAKE SOMEONE SMILE
          </div>
          <h1>
            Welcome back, Dr. Gifted <span className="wave">✺</span>
          </h1>
          <p>Here’s what’s happening at your practice today.</p>
        </div>
        <div className="heading-actions">
          <span className="date-pill">
            <CalendarDays size={16} />
            {new Date().toLocaleDateString("en", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Button onClick={() => edit("patients")}>
            <Plus size={17} />
            Register Patient
          </Button>
        </div>
      </div>
      <div className="stats-grid dashboard-stats">
        <Stat
          label="Total patients"
          value={db.patients.length.toLocaleString()}
          note="across your practice"
          icon={Users}
        />
        <Stat
          label="Today's appointments"
          value={appointments.length}
          note={`${appointments.filter((r) => r.status === "Confirmed").length} confirmed today`}
          icon={CalendarDays}
        />
        <Stat
          label="Active laboratory orders"
          value={activeLab.length}
          note={`${c.overdue} need your attention`}
          icon={FlaskConical}
        />
        <Stat
          label="Outstanding payments"
          value={money(c.totalBalance)}
          note="across open invoices"
          icon={Wallet}
        />
      </div>
      <div className="dashboard-grid">
        <Card
          title="Patient growth"
          subtitle="A little more trust, every month."
          action={
            <select
              aria-label="Patient chart period"
              className="compact-select"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="6">Last 6 months</option>
              <option value="3">Last 3 months</option>
            </select>
          }
        >
          <div className="chart-summary">
            <strong>{registration.reduce((s, r) => s + r.value, 0)}</strong>
            <span>
              <i />
              New patients in selected period
            </span>
          </div>
          <TrendChart data={registration} />
        </Card>
        <Card
          title="Appointments overview"
          subtitle="Today’s care, at a glance."
        >
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={[
                    "Completed",
                    "Confirmed",
                    "Checked In",
                    "Scheduled",
                    "Cancelled",
                  ].map((s, i) => ({
                    name: s,
                    value: appointments.filter((r) => r.status === s).length,
                    color: [
                      "#ffb366",
                      "#ffdbc0",
                      "#8db9a5",
                      "#e8e4df",
                      "#c6c0b9",
                    ][i],
                  }))}
                  dataKey="value"
                  innerRadius={61}
                  outerRadius={82}
                  paddingAngle={4}
                  stroke="none"
                >
                  {["#ffb366", "#ffdbc0", "#8db9a5", "#e8e4df", "#c6c0b9"].map(
                    (x) => (
                      <Cell key={x} fill={x} />
                    ),
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <strong>{appointments.length}</strong>
              <span>appointments</span>
            </div>
          </div>
          <div className="donut-legend">
            {["Completed", "Confirmed", "Scheduled"].map((s, i) => (
              <span key={s}>
                <i
                  style={{ background: ["#ffb366", "#ffdbc0", "#e8e4df"][i] }}
                />
                {s}
                <b>{appointments.filter((r) => r.status === s).length}</b>
              </span>
            ))}
          </div>
        </Card>
      </div>
      <div className="dashboard-grid appointments-grid">
        <Card
          title="Today's appointments"
          subtitle={`${appointments.length} appointments on your schedule`}
          action={
            <Link className="text-link" href="/appointments">
              View calendar <ArrowRight size={14} />
            </Link>
          }
        >
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>TIME</th>
                  <th>PATIENT</th>
                  <th>APPOINTMENT</th>
                  <th>STATUS</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((r) => (
                  <tr key={r.id}>
                    <td>
                      <b>{r.time}</b>
                      <small>{r.duration} min</small>
                    </td>
                    <td>
                      <div className="person">
                        <Avatar small name={patientName(r.patient)} />
                        <div>
                          <b>{patientName(r.patient)}</b>
                          <small>{r.patient}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {r.name}
                      <small>{staffName(r.professional)}</small>
                    </td>
                    <td>
                      <Badge value={r.status} />
                    </td>
                    <td>
                      <button
                        className="icon-button"
                        aria-label="View appointment"
                        onClick={() => c.openRow("appointments", r)}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!appointments.length && (
              <div className="empty">
                A clear schedule. Create your first appointment.
              </div>
            )}
          </div>
          <button
            className="card-bottom-action"
            onClick={() => edit("appointments")}
          >
            <Plus size={15} />
            Schedule an appointment
          </button>
        </Card>
        <Card
          title="Laboratory pulse"
          subtitle="Precision in every step."
          action={
            <span className="tiny-icon">
              <FlaskConical size={18} />
            </span>
          }
        >
          <div className="lab-pulse">
            {[
              ["In Production", "Work in progress", "#ffb366"],
              ["Quality Control", "Finishing touches", "#93afa2"],
              ["Ready for Delivery", "Ready for a new smile", "#90a9c4"],
            ].map(([s, n, color]) => (
              <Link href="/laboratory" className="pulse-row" key={s}>
                <span
                  className="pulse-icon"
                  style={{ color, background: color + "20" }}
                >
                  <FlaskConical size={19} />
                </span>
                <div>
                  <b>{s}</b>
                  <small>{n}</small>
                </div>
                <strong>
                  {db.laboratory
                    .filter((r) => r.status === s)
                    .length.toString()
                    .padStart(2, "0")}
                </strong>
              </Link>
            ))}
          </div>
          <div className="attention">
            <span className="attention-dot" />
            <div>
              <b>{c.overdue} orders need attention</b>
              <p>Keep every smile on schedule.</p>
            </div>
            <Link href="/laboratory" aria-label="Review laboratory orders">
              <ArrowRight size={18} />
            </Link>
          </div>
          <Link href="/laboratory" className="card-bottom-action">
            Open laboratory <ArrowRight size={14} />
          </Link>
        </Card>
      </div>
      <div className="dashboard-grid">
        <Card
          title="Revenue overview"
          subtitle="Simulated payments received · NGN"
        >
          <div className="chart-summary">
            <strong>
              {money(db.billing.reduce((s, r) => s + amount(r, "paid"), 0))}
            </strong>
            <span>Recorded demo payments</span>
          </div>
          <TrendChart
            data={monthly(db.billing, (r) => amount(r, "paid"))}
            bar
          />
        </Card>
        <Card
          title="Recent activity"
          subtitle="The little things moving care forward."
        >
          <div className="activity-list">
            {[
              ...db.activity,
              ...db["dental-records"].slice(0, 2).map((r) => ({
                ...r,
                name: `Clinical record · ${patientName(r.patient)}`,
              })),
              ...db.laboratory
                .slice(0, 2)
                .map((r) => ({ ...r, name: `${r.name} · ${r.id}` })),
            ]
              .slice(0, 5)
              .map((r, i) => (
                <div className="activity-item" key={r.id}>
                  <span>
                    <Activity size={16} />
                  </span>
                  <div>
                    <b>{r.name}</b>
                    <p>
                      {r.status} <span>· {r.date}</span>
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
      <div className="dashboard-grid">
        <Card
          title="Recent patients"
          subtitle="New faces. Lasting relationships."
          action={
            <Link href="/patients" className="text-link">
              All patients <ArrowRight size={14} />
            </Link>
          }
        >
          <div className="recent-patients">
            {[...db.patients]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 4)
              .map((r) => (
                <Link key={r.id} href={"/patients/" + r.id}>
                  <Avatar name={r.name} />
                  <div>
                    <b>{r.name}</b>
                    <small>
                      {r.id} · {r.email}
                    </small>
                  </div>
                  <ChevronRight size={16} />
                </Link>
              ))}
          </div>
        </Card>
        <Card
          title="Care at a glance"
          subtitle="A connected snapshot of your practice."
        >
          <div className="care-metrics">
            <div>
              <span>New patients this month</span>
              <b>
                {
                  db.patients.filter(
                    (r) => r.date.slice(0, 7) === today().slice(0, 7),
                  ).length
                }
              </b>
            </div>
            <div>
              <span>Completed treatment plans</span>
              <b>
                {
                  db["treatment-plans"].filter((r) => r.status === "Completed")
                    .length
                }
              </b>
            </div>
            <div>
              <span>Patients requiring follow-up</span>
              <b>
                {db.patients.filter((r) => r.status === "Follow-up").length}
              </b>
            </div>
            <div>
              <span>Orders delivered</span>
              <b>
                {db.laboratory.filter((r) => r.status === "Delivered").length}
              </b>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
const columns: Record<string, [string, string][]> = {
  patients: [
    ["name", "Patient"],
    ["id", "Patient ID"],
    ["dob", "Age"],
    ["phone", "Phone"],
    ["lastVisit", "Last visit"],
    ["nextAppointment", "Next appointment"],
    ["status", "Status"],
  ],
  appointments: [
    ["time", "Time"],
    ["patient", "Patient"],
    ["name", "Appointment type"],
    ["professional", "Professional"],
    ["date", "Date"],
    ["status", "Status"],
  ],
  "dental-records": [
    ["id", "Record ID"],
    ["patient", "Patient"],
    ["name", "Visit / complaint"],
    ["professional", "Professional"],
    ["date", "Visit date"],
    ["status", "Status"],
  ],
  "treatment-plans": [
    ["name", "Treatment plan"],
    ["patient", "Patient"],
    ["date", "Created"],
    ["professional", "Professional"],
    ["price", "Estimated cost"],
    ["priority", "Priority"],
    ["status", "Status"],
  ],
  procedures: [
    ["id", "Code"],
    ["name", "Procedure"],
    ["category", "Category"],
    ["price", "Default price"],
    ["duration", "Duration"],
    ["status", "Status"],
  ],
  prescriptions: [
    ["id", "Prescription ID"],
    ["patient", "Patient"],
    ["professional", "Professional"],
    ["date", "Date"],
    ["medicationCount", "Medications"],
    ["status", "Status"],
  ],
  laboratory: [
    ["id", "Order ID"],
    ["patient", "Patient"],
    ["name", "Work type"],
    ["technician", "Technician"],
    ["due", "Due date"],
    ["priority", "Priority"],
    ["status", "Status"],
  ],
  billing: [
    ["id", "Invoice"],
    ["patient", "Patient"],
    ["date", "Issued"],
    ["due", "Due"],
    ["total", "Total"],
    ["paid", "Paid"],
    ["balance", "Balance"],
    ["status", "Status"],
  ],
  staff: [
    ["name", "Staff member"],
    ["role", "Role"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["date", "Joined"],
    ["status", "Status"],
  ],
};
function exportCSV(rows: Row[], name: string) {
  const keys = Array.from(new Set(rows.flatMap(Object.keys)));
  const csv = [
    keys,
    ...rows.map((r) =>
      keys.map((k) =>
        Array.isArray(r[k]) ? (r[k] as string[]).join("; ") : (r[k] ?? ""),
      ),
    ),
  ]
    .map((r) =>
      r.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","),
    )
    .join("\n");
  const url = URL.createObjectURL(
    new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name + ".csv";
  a.click();
  URL.revokeObjectURL(url);
}
function ModulePage(c: Ctx & { section: string }) {
  const { db, section, patientName, staffName, money } = c;
  const [search, setSearch] = useState(""),
    [status, setStatus] = useState("All"),
    [category, setCategory] = useState("All"),
    [professional, setProfessional] = useState("All"),
    [dateFilter, setDateFilter] = useState(""),
    [sort, setSort] = useState("date"),
    [asc, setAsc] = useState(false),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState<string[]>([]),
    [calendar, setCalendar] = useState(false),
    [calendarMode, setCalendarMode] = useState(c.settings.calendar || "Week"),
    [calendarDate, setCalendarDate] = useState(today());
  const rows = db[section].map((r) =>
    section === "billing"
      ? {
          ...r,
          status: invoiceStatus(r),
          balance: Math.max(0, amount(r, "total") - amount(r, "paid")),
        }
      : r,
  );
  const filtered = rows
    .filter(
      (r) =>
        (r.name + " " + r.id + " " + patientName(r.patient))
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (status === "All" || r.status === status) &&
        (category === "All" ||
          r.category === category ||
          r.role === category) &&
        (professional === "All" || r.professional === professional) &&
        (!dateFilter || r.date === dateFilter),
    )
    .sort((a, b) => {
      const x = a[sort],
        y = b[sort];
      return (
        (typeof x === "number" && typeof y === "number"
          ? x - y
          : str(x).localeCompare(str(y))) * (asc ? 1 : -1)
      );
    });
  const pages = Math.max(1, Math.ceil(filtered.length / 8));
  const visible = filtered.slice(
    (Math.min(page, pages) - 1) * 8,
    Math.min(page, pages) * 8,
  );
  useEffect(() => {
    setPage(1);
  }, [search, status, category, professional, dateFilter]);
  function value(r: Row, key: string): React.ReactNode {
    if (key === "medicationCount")
      return 1 + ((r.extraMeds as string[]) || []).length;
    if (key === "status" || key === "priority")
      return <Badge value={str(r[key])} />;
    if (key === "patient")
      return (
        <Link className="person patient-link" href={"/patients/" + r.patient}>
          <Avatar name={patientName(r.patient)} small />
          <div>
            <b>{patientName(r.patient)}</b>
            <small>{r.patient}</small>
          </div>
        </Link>
      );
    if (key === "professional" || key === "technician")
      return staffName(r[key]);
    if (key === "name")
      return (
        <button className="row-name" onClick={() => c.openRow(section, r)}>
          {section === "patients" || section === "staff" ? (
            <Avatar name={r.name} small />
          ) : null}
          <span>
            <b>{r.name}</b>
            {section === "patients" && <small>{r.email}</small>}
          </span>
        </button>
      );
    if (["price", "total", "paid", "balance"].includes(key))
      return money(amount(r, key));
    if (key === "dob") {
      const dob = new Date(str(r.dob));
      const now = new Date();
      let age = now.getFullYear() - dob.getFullYear();
      if (
        now.getMonth() < dob.getMonth() ||
        (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())
      )
        age--;
      return `${age} years`;
    }
    if (key === "lastVisit")
      return (
        db["dental-records"]
          .filter((x) => x.patient === r.id)
          .map((x) => x.date)
          .sort()
          .pop() || "No visits"
      );
    if (key === "nextAppointment")
      return (
        db.appointments
          .filter(
            (x) =>
              x.patient === r.id &&
              x.date >= today() &&
              !["Cancelled", "Completed"].includes(x.status),
          )
          .map((x) => x.date)
          .sort()[0] || "Not scheduled"
      );
    return str(r[key]) + (key === "duration" ? " min" : "");
  }
  return (
    <>
      <div className="stats-grid module-stats">
        {section === "patients" ? (
          <>
            <Stat
              label="Total patients"
              value={rows.length}
              note="registered in this workspace"
            />
            <Stat
              label="New this month"
              value={
                rows.filter((r) => r.date.slice(0, 7) === today().slice(0, 7))
                  .length
              }
              note="a growing community"
              icon={Sparkles}
            />
            <Stat
              label="Active patients"
              value={rows.filter((r) => r.status === "Active").length}
              note="in ongoing care"
              icon={HeartPulse}
            />
            <Stat
              label="Follow-up needed"
              value={rows.filter((r) => r.status === "Follow-up").length}
              note="keep their care connected"
              icon={Clock}
            />
          </>
        ) : section === "billing" ? (
          <>
            <Stat
              label="Total invoiced"
              value={money(
                rows
                  .filter((r) => r.status !== "Cancelled")
                  .reduce((s, r) => s + amount(r, "total"), 0),
              )}
              note="fictional invoices"
              icon={CreditCard}
            />
            <Stat
              label="Payments received"
              value={money(rows.reduce((s, r) => s + amount(r, "paid"), 0))}
              note="simulated payments"
              icon={Wallet}
            />
            <Stat
              label="Outstanding balance"
              value={money(
                rows
                  .filter((r) => r.status !== "Cancelled")
                  .reduce((s, r) => s + amount(r, "balance"), 0),
              )}
              note="across open invoices"
              icon={Clock}
            />
            <Stat
              label="Overdue invoices"
              value={rows.filter((r) => r.status === "Overdue").length}
              note="ready for review"
              icon={ClipboardList}
            />
          </>
        ) : section === "laboratory" ? (
          <>
            {[
              "All active",
              "In Production",
              "Quality Control",
              "Ready for Delivery",
            ].map((s, i) => (
              <Stat
                key={s}
                label={s === "All active" ? "Active orders" : s}
                value={
                  rows.filter((r) =>
                    i === 0
                      ? !["Delivered", "Cancelled"].includes(r.status)
                      : r.status === s,
                  ).length
                }
                note={
                  i === 0
                    ? `${rows.filter((r) => str(r.due) < today() && !["Delivered", "Cancelled"].includes(r.status)).length} overdue`
                    : "in the production workflow"
                }
                icon={FlaskConical}
              />
            ))}
          </>
        ) : (
          <>
            <Stat
              label="Total records"
              value={rows.length}
              note="connected demonstration records"
              icon={ClipboardList}
            />
            <Stat
              label="Completed / active"
              value={
                rows.filter((r) =>
                  ["Active", "Completed", "Finalized", "Issued"].includes(
                    r.status,
                  ),
                ).length
              }
              note="up to date"
              icon={CheckCircle2}
            />
            <Stat
              label="Drafts / scheduled"
              value={
                rows.filter((r) =>
                  ["Draft", "Scheduled", "Confirmed"].includes(r.status),
                ).length
              }
              note="ready for the next step"
              icon={Clock}
            />
          </>
        )}
      </div>
      <section className="card table-card">
        <div className="table-heading">
          <div>
            <h2>
              {modules.find((m) => m[0] === section)?.[1]}{" "}
              <span className="count">{filtered.length}</span>
            </h2>
            <p>Organized for better care. All records are fictional.</p>
          </div>
          <div className="table-actions">
            {section === "appointments" && (
              <div className="segmented">
                <button
                  className={!calendar ? "selected" : ""}
                  onClick={() => setCalendar(false)}
                >
                  List
                </button>
                <button
                  className={calendar ? "selected" : ""}
                  onClick={() => setCalendar(true)}
                >
                  Calendar
                </button>
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => exportCSV(filtered, section)}
            >
              <Download size={15} />
              Export
            </Button>
          </div>
        </div>
        <div className="filter-bar">
          <div className="input-icon">
            <Search size={17} />
            <input
              aria-label="Search records"
              placeholder={
                "Search " +
                modules.find((m) => m[0] === section)?.[1].toLowerCase() +
                "..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            aria-label="Filter status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All statuses</option>
            {statuses[section]?.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {["procedures", "staff"].includes(section) && (
            <select
              aria-label="Filter category or role"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">
                All {section === "staff" ? "roles" : "categories"}
              </option>
              {Array.from(
                new Set(rows.map((r) => str(r.category || r.role))),
              ).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          )}
          {["appointments", "dental-records"].includes(section) && (
            <>
              <select
                aria-label="Filter professional"
                value={professional}
                onChange={(e) => setProfessional(e.target.value)}
              >
                <option value="All">All professionals</option>
                {db.staff
                  .filter((r) => r.role === "Dentist")
                  .map((r) => (
                    <option value={r.id} key={r.id}>
                      {r.name}
                    </option>
                  ))}
              </select>
              <input
                type="date"
                aria-label="Filter visit date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </>
          )}
          {(status !== "All" ||
            search ||
            dateFilter ||
            professional !== "All" ||
            category !== "All") && (
            <button
              className="text-link"
              onClick={() => {
                setStatus("All");
                setSearch("");
                setDateFilter("");
                setProfessional("All");
                setCategory("All");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
        {selected.length > 0 && (
          <div className="selection-bar">
            {selected.length} selected{" "}
            <button
              onClick={() => {
                exportCSV(
                  filtered.filter((r) => selected.includes(r.id)),
                  section + "-selected",
                );
                setSelected([]);
              }}
            >
              Export selected
            </button>
            <button onClick={() => setSelected([])}>Clear selection</button>
          </div>
        )}
        {calendar && section === "appointments" ? (
          <CalendarView
            rows={filtered}
            patientName={patientName}
            date={calendarDate}
            setDate={setCalendarDate}
            mode={calendarMode}
            setMode={setCalendarMode}
            open={(r) => c.openRow(section, r)}
          />
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input
                        aria-label="Select all visible records"
                        type="checkbox"
                        checked={
                          visible.length > 0 &&
                          visible.every((r) => selected.includes(r.id))
                        }
                        onChange={(e) =>
                          setSelected(
                            e.target.checked
                              ? Array.from(
                                  new Set([
                                    ...selected,
                                    ...visible.map((r) => r.id),
                                  ]),
                                )
                              : selected.filter(
                                  (id) => !visible.some((r) => r.id === id),
                                ),
                          )
                        }
                      />
                    </th>
                    {columns[section].map(([key, label]) => (
                      <th key={key}>
                        <button
                          onClick={() => {
                            setAsc(sort === key ? !asc : true);
                            setSort(key);
                          }}
                        >
                          {label}
                          {sort === key && <span>{asc ? " ↑" : " ↓"}</span>}
                        </button>
                      </th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <input
                          aria-label={"Select " + r.id}
                          type="checkbox"
                          checked={selected.includes(r.id)}
                          onChange={(e) =>
                            setSelected(
                              e.target.checked
                                ? [...selected, r.id]
                                : selected.filter((id) => id !== r.id),
                            )
                          }
                        />
                      </td>
                      {columns[section].map(([key]) => (
                        <td key={key}>{value(r, key)}</td>
                      ))}
                      <td>
                        <MenuDrop>
                          <Action onClick={() => c.openRow(section, r)}>
                            View details
                          </Action>
                          <Action onClick={() => c.edit(section, r)}>
                            Edit record
                          </Action>
                          {section === "patients" ? (
                            <Action
                              onClick={() =>
                                c.confirm(
                                  "Archive this patient? Their history stays in the workspace.",
                                  () => c.update(section, r, "Archived"),
                                )
                              }
                            >
                              Archive patient
                            </Action>
                          ) : section === "procedures" ||
                            section === "staff" ? (
                            <Action
                              onClick={() =>
                                c.update(
                                  section,
                                  r,
                                  r.status === "Active" ? "Inactive" : "Active",
                                )
                              }
                            >
                              {r.status === "Active"
                                ? "Deactivate"
                                : "Activate"}
                            </Action>
                          ) : null}
                          {section === "appointments" && (
                            <>
                              <Action
                                onClick={() =>
                                  c.update(section, r, "Checked In")
                                }
                              >
                                Check in
                              </Action>
                              <Action
                                onClick={() =>
                                  c.update(section, r, "Completed")
                                }
                              >
                                Mark completed
                              </Action>
                              <Action
                                onClick={() =>
                                  c.confirm("Cancel this appointment?", () =>
                                    c.update(section, r, "Cancelled"),
                                  )
                                }
                              >
                                Cancel appointment
                              </Action>
                            </>
                          )}
                        </MenuDrop>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!visible.length && (
                <div className="empty">
                  <Search />
                  <h3>No records found</h3>
                  <p>Try another search or clear your filters.</p>
                </div>
              )}
            </div>
            <div className="pagination">
              <span>
                Showing{" "}
                {filtered.length ? (Math.min(page, pages) - 1) * 8 + 1 : 0}–
                {Math.min(Math.min(page, pages) * 8, filtered.length)} of{" "}
                {filtered.length} records
              </span>
              <div>
                <button
                  disabled={page <= 1}
                  className="icon-button"
                  aria-label="Previous page"
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft size={17} />
                </button>
                <span>
                  Page {Math.min(page, pages)} of {pages}
                </span>
                <button
                  disabled={page >= pages}
                  className="icon-button"
                  aria-label="Next page"
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
function CalendarView({
  rows,
  patientName,
  date,
  setDate,
  mode,
  setMode,
  open,
}: {
  rows: Row[];
  patientName: Ctx["patientName"];
  date: string;
  setDate: (v: string) => void;
  mode: string;
  setMode: (v: string) => void;
  open: (r: Row) => void;
}) {
  const start = new Date(date + "T12:00:00");
  const days =
    mode === "Day"
      ? 1
      : mode === "Month"
        ? new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()
        : 7;
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    if (mode === "Month") d.setDate(1 + i);
    else d.setDate(d.getDate() + i);
    return d.toLocaleDateString("en-CA");
  });
  function move(n: number) {
    const d = new Date(start);
    if (mode === "Month") d.setMonth(d.getMonth() + n);
    else d.setDate(d.getDate() + n * days);
    setDate(d.toLocaleDateString("en-CA"));
  }
  return (
    <>
      <div className="calendar-toolbar">
        <div>
          <button
            className="icon-button"
            onClick={() => move(-1)}
            aria-label="Previous period"
          >
            <ChevronLeft size={18} />
          </button>
          <b>
            {start.toLocaleDateString("en", {
              month: "long",
              year: "numeric",
              day: "numeric",
            })}
          </b>
          <button
            className="icon-button"
            onClick={() => move(1)}
            aria-label="Next period"
          >
            <ChevronRight size={18} />
          </button>
          <Button variant="outline" onClick={() => setDate(today())}>
            Today
          </Button>
        </div>
        <select
          aria-label="Calendar view"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          {["Day", "Week", "Month"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div
        className={"calendar-grid " + (mode === "Month" ? "month" : "")}
        style={{
          gridTemplateColumns: `repeat(${mode === "Day" ? 1 : 7}, minmax(125px,1fr))`,
        }}
      >
        {dates.map((d) => (
          <div className="calendar-day" key={d}>
            <header className={d === today() ? "is-today" : ""}>
              {new Date(d + "T12:00:00").toLocaleDateString("en", {
                weekday: "short",
                day: "numeric",
              })}
            </header>
            {rows
              .filter((r) => r.date === d)
              .sort((a, b) => str(a.time).localeCompare(str(b.time)))
              .map((r) => (
                <button
                  key={r.id}
                  className="calendar-event"
                  onClick={() => open(r)}
                >
                  <b>
                    {r.time} · {patientName(r.patient)}
                  </b>
                  <span>{r.name}</span>
                  <small>{r.status}</small>
                </button>
              ))}
          </div>
        ))}
      </div>
    </>
  );
}
type Field = {
  key: string;
  label: string;
  type?: string;
  options?: string[];
  required?: boolean;
  full?: boolean;
};
function fieldsFor(mod: string, db: Database): Field[] {
  const patient = {
    key: "patient",
    label: "Patient",
    type: "patient",
    required: true,
  };
  const professional = {
    key: "professional",
    label: "Responsible professional",
    type: "professional",
    required: true,
  };
  const date = { key: "date", label: "Date", type: "date", required: true };
  const notes = {
    key: "notes",
    label: "Additional notes",
    type: "textarea",
    full: true,
  };
  const name = { key: "name", label: "Name / title", required: true };
  const teeth = { key: "teeth", label: "Teeth involved (FDI)" };
  const fields: Record<string, Field[]> = {
    patients: [
      { ...name, label: "Full name" },
      { key: "dob", label: "Date of birth", type: "date", required: true },
      { key: "phone", label: "Phone number", required: true },
      { key: "email", label: "Email address", type: "email", required: true },
      {
        key: "sex",
        label: "Sex",
        options: ["Prefer not to say", "Female", "Male", "Other"],
      },
      { key: "address", label: "Address" },
      { key: "emergency", label: "Emergency contact" },
      { key: "allergies", label: "Known allergies" },
      { key: "medications", label: "Current medications" },
      { key: "history", label: "Medical history", type: "textarea" },
      { key: "dentalHistory", label: "Dental history", type: "textarea" },
      notes,
    ],
    appointments: [
      patient,
      professional,
      { ...name, label: "Appointment type" },
      date,
      { key: "time", label: "Start time", type: "time", required: true },
      {
        key: "duration",
        label: "Duration (minutes)",
        type: "number",
        required: true,
      },
      notes,
    ],
    "dental-records": [
      patient,
      professional,
      { ...name, label: "Visit title" },
      date,
      { key: "complaint", label: "Presenting complaint", required: true },
      {
        key: "findings",
        label: "Examination findings",
        type: "textarea",
        required: true,
      },
      {
        key: "assessment",
        label: "Clinical assessment",
        type: "textarea",
        required: true,
      },
      { key: "treatment", label: "Treatment performed", type: "textarea" },
      teeth,
      { key: "followup", label: "Follow-up date", type: "date" },
      notes,
      {
        key: "attachments",
        label: "Simulated attachments",
        type: "file",
        full: true,
      },
    ],
    "treatment-plans": [
      patient,
      professional,
      { ...name, label: "Plan name" },
      date,
      {
        key: "priority",
        label: "Priority",
        options: ["Normal", "High", "Low"],
      },
      teeth,
      {
        key: "procedures",
        label: "Included procedures",
        type: "multi",
        full: true,
      },
      notes,
    ],
    procedures: [
      { ...name, label: "Procedure name" },
      {
        key: "category",
        label: "Category",
        options: [
          "Consultation",
          "Examination",
          "Preventive care",
          "Restorations",
          "Extractions",
          "Crowns",
          "Bridges",
          "Dentures",
          "Implants",
          "Dental prosthetics",
          "Repairs and adjustments",
        ],
      },
      {
        key: "price",
        label: "Default price (NGN)",
        type: "number",
        required: true,
      },
      {
        key: "duration",
        label: "Duration (minutes)",
        type: "number",
        required: true,
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        full: true,
      },
    ],
    prescriptions: [
      patient,
      professional,
      date,
      {
        key: "medication",
        label: "Medication name (demo only)",
        required: true,
      },
      { key: "strength", label: "Strength", required: true },
      { key: "dosage", label: "Dosage instructions", required: true },
      { key: "route", label: "Route", options: ["Oral", "Topical", "Other"] },
      { key: "frequency", label: "Frequency", required: true },
      { key: "duration", label: "Duration", required: true },
      { key: "quantity", label: "Quantity", type: "number", required: true },
      notes,
    ],
    laboratory: [
      patient,
      professional,
      {
        ...name,
        label: "Work type",
        options: [
          "Complete Denture",
          "Partial Denture",
          "Crown",
          "Bridge",
          "Implant-Supported Prosthetic",
          "Removable Prosthetic",
          "Repair",
          "Adjustment",
          "Other Custom Appliance",
        ],
      },
      teeth,
      { key: "material", label: "Material", required: true },
      { key: "shade", label: "Shade", required: true },
      {
        key: "impression",
        label: "Impression / scan",
        options: [
          "Awaiting impression",
          "Physical impression received",
          "Digital scan received",
        ],
      },
      {
        key: "technician",
        label: "Assigned technician",
        type: "technician",
        required: true,
      },
      date,
      { key: "due", label: "Due date", type: "date", required: true },
      {
        key: "price",
        label: "Estimated cost (NGN)",
        type: "number",
        required: true,
      },
      {
        key: "priority",
        label: "Priority",
        options: ["Normal", "High", "Low"],
      },
      { ...notes, label: "Production instructions" },
      {
        key: "attachments",
        label: "Simulated attachments",
        type: "file",
        full: true,
      },
    ],
    billing: [
      patient,
      date,
      { key: "due", label: "Due date", type: "date", required: true },
      { key: "items", label: "Invoice items", type: "multi", full: true },
      { key: "discount", label: "Discount (NGN)", type: "number" },
      notes,
    ],
    staff: [
      { ...name, label: "Full name" },
      {
        key: "role",
        label: "Role (visual demo only)",
        options: [
          "Administrator",
          "Dentist",
          "Dental Assistant",
          "Laboratory Technician",
          "Receptionist",
          "Accountant",
        ],
      },
      { key: "email", label: "Email address", type: "email", required: true },
      { key: "phone", label: "Phone", required: true },
      date,
    ],
  };
  return fields[mod] || [];
}
function Editor(
  c: Ctx & { module: string; row?: Row; patient?: string; onClose: () => void },
) {
  const { db, module: mod, row } = c;
  const [extraMeds, setExtraMeds] = useState<Record<string, string>[]>(() =>
    ((row?.extraMeds as string[]) || []).map((m) => JSON.parse(m)),
  );
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      ((row?.items as string[]) || []).map((id, i) => [
        id,
        Number(((row?.itemQuantities as string[]) || [])[i] || 1),
      ]),
    ),
  );
  const fields = fieldsFor(mod, db);
  const [error, setError] = useState("");
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) {
    if (f.type === "multi")
      shape[f.key] = z
        .array(z.string())
        .min(1, "Choose at least one procedure.");
    else if (f.type === "file") shape[f.key] = z.any().optional();
    else if (f.type === "number")
      shape[f.key] = z.coerce
        .number()
        .min(
          f.key === "duration" || f.key === "quantity" ? 1 : 0,
          "Enter a valid non-negative amount.",
        )
        .max(100000000, "Value is too large.");
    else if (f.type === "email")
      shape[f.key] = z.string().email("Enter a valid email address.");
    else
      shape[f.key] = f.required
        ? z.string().trim().min(1, "This field is required.")
        : z.string().optional();
  }
  shape.status = z.string();
  const schema = z.object(shape);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + (Number(c.settings.turnaround) || 7));
  const defaults: Record<string, unknown> = {
    due: dueDate.toLocaleDateString("en-CA"),
    date: today(),
    time: "09:00",
    duration: mod === "prescriptions" ? "" : Number(c.settings.duration) || 30,
    price: 0,
    quantity: 1,
    discount: 0,
    status: statuses[mod][0],
    patient: c.patient || "",
    items: [],
    procedures: [],
    ...row,
  };
  for (const f of fields)
    if (defaults[f.key] === undefined) defaults[f.key] = f.options?.[0] || "";
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Record<string, any>>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });
  const watched = watch();
  const chosen = (watched.items || watched.procedures || []) as string[];
  const subtotal =
    Math.round(
      chosen.reduce(
        (sum, id) =>
          sum +
          Math.round(
            amount(
              db.procedures.find((p) => p.id === id) || ({} as Row),
              "price",
            ) * 100,
          ) *
            (mod === "billing" ? (quantities[id] ?? 1) : 1),
        0,
      ),
    ) / 100;
  const discount = Number(watched.discount) || 0;
  function submit(values: Record<string, any>) {
    setError("");
    if (
      mod === "prescriptions" &&
      extraMeds.some(
        (m) =>
          [
            "medication",
            "strength",
            "dosage",
            "route",
            "frequency",
            "duration",
            "quantity",
          ].some((k) => !m[k]?.trim()) ||
          !Number.isInteger(Number(m.quantity)) ||
          Number(m.quantity) < 1,
      )
    ) {
      setError(
        "Complete all fields for each additional medication and use a positive whole-number quantity.",
      );
      return;
    }
    if (
      mod === "billing" &&
      chosen.some(
        (id) =>
          !Number.isInteger(quantities[id] ?? 1) ||
          (quantities[id] ?? 1) < 1 ||
          (quantities[id] ?? 1) > 10000,
      )
    ) {
      setError(
        "Each invoice item needs a whole-number quantity from 1 to 10,000.",
      );
      return;
    }
    if (mod === "patients" && values.dob > today()) {
      setError("Date of birth must be today or earlier.");
      return;
    }
    if (["billing", "laboratory"].includes(mod) && values.due < values.date) {
      setError("Due date must be on or after the creation date.");
      return;
    }
    if (mod === "appointments") {
      const hours = (c.settings.working || "09:00–17:00")
        .split(/[–-]/)
        .map((x) => x.trim());
      const opening = /^\d{2}:\d{2}$/.test(hours[0]) ? hours[0] : "09:00";
      const closing = /^\d{2}:\d{2}$/.test(hours[1] || "") ? hours[1] : "17:00";
      if (
        values.time < opening ||
        values.time >= closing ||
        Number(values.time.slice(0, 2)) * 60 +
          Number(values.time.slice(3)) +
          Number(values.duration) >
          Number(closing.slice(0, 2)) * 60 + Number(closing.slice(3))
      ) {
        setError(
          "Appointments must fit within the configured practice working hours.",
        );
        return;
      }
      const time = (s: string) =>
        Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
      const start = time(values.time),
        end = start + Number(values.duration);
      const conflict = db.appointments.some(
        (a) =>
          a.id !== row?.id &&
          a.professional === values.professional &&
          a.date === values.date &&
          !["Cancelled", "No Show"].includes(a.status) &&
          !["Cancelled", "No Show"].includes(values.status) &&
          start < time(str(a.time)) + amount(a, "duration") &&
          end > time(str(a.time)),
      );
      if (conflict) {
        setError(
          "This professional already has an appointment during that time. Choose another time or professional.",
        );
        return;
      }
    }
    if (
      mod === "billing" &&
      (discount > subtotal ||
        subtotal - discount < amount(row || ({} as Row), "paid"))
    ) {
      setError(
        "Discount cannot exceed the subtotal or reduce the total below payments already recorded.",
      );
      return;
    }
    const prefixes: Record<string, string> = {
      patients: "PAT",
      appointments: "APT",
      "dental-records": "REC",
      "treatment-plans": "TPL",
      procedures: "PRC",
      prescriptions: "RX",
      laboratory: "LAB",
      billing: "INV",
      staff: "STF",
    };
    const prefix =
      mod === "laboratory"
        ? c.settings.orderPrefix || "LAB"
        : mod === "billing"
          ? c.settings.invoicePrefix || "INV"
          : prefixes[mod];
    const id =
      row?.id ||
      `${prefix.replace(/[^A-Za-z0-9]/g, "").toUpperCase() || prefixes[mod]}-${String(Math.max(0, ...db[mod].map((r) => Number(r.id.split("-")[1]) || 0)) + 1).padStart(4, "0")}`;
    const output: Row = {
      ...row,
      ...values,
      id,
      name:
        values.name ||
        row?.name ||
        (mod === "prescriptions"
          ? "Demonstration prescription"
          : `Invoice ${id}`),
      date: values.date || row?.date || today(),
      status: values.status,
    };
    if (mod === "billing") {
      output.subtotal = subtotal;
      output.total =
        (Math.round(subtotal * 100) - Math.round(discount * 100)) / 100;
      output.itemQuantities = chosen.map((id) => str(quantities[id] ?? 1));
      output.itemPrices = chosen.map((id) =>
        str(
          amount(
            db.procedures.find((p) => p.id === id) || ({} as Row),
            "price",
          ),
        ),
      );
      output.discount = discount;
      output.paid = row?.paid || 0;
      output.payments = row?.payments || [];
      output.status = invoiceStatus(output);
    }
    if (mod === "prescriptions")
      output.extraMeds = extraMeds.map((m) => JSON.stringify(m));
    if (mod === "treatment-plans") output.price = subtotal;
    if (mod === "laboratory")
      output.history = [
        ...((row?.history as string[]) || []),
        `${today()} · ${values.status}`,
      ];
    if (values.attachments instanceof FileList)
      output.attachments = Array.from(values.attachments as FileList).map(
        (f: File) => f.name,
      );
    c.save(mod, output);
    c.onClose();
  }
  return (
    <Modal
      open
      onClose={c.onClose}
      title={
        row
          ? "Edit " + (mod === "patients" ? "patient" : row.id)
          : createLabels[mod]
      }
      description={
        mod === "prescriptions"
          ? "Fictional record only. Not valid for dispensing or clinical use."
          : undefined
      }
    >
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="form-grid">
          {fields.map((f) => (
            <label key={f.key} className={f.full ? "full" : ""}>
              <span>
                {f.label}
                {f.required && <em> *</em>}
              </span>
              {f.type === "textarea" ? (
                <textarea {...register(f.key)} rows={3} />
              ) : f.type === "multi" ? (
                <div className="multi-select">
                  {db.procedures
                    .filter(
                      (p) => p.status === "Active" || chosen.includes(p.id),
                    )
                    .map((p) => (
                      <label key={p.id}>
                        <input
                          type="checkbox"
                          value={p.id}
                          {...register(f.key)}
                        />
                        <span>{p.name}</span>
                        <small>{c.money(amount(p, "price"))}</small>
                      </label>
                    ))}
                </div>
              ) : ["patient", "professional", "technician"].includes(
                  f.type || "",
                ) ? (
                <select {...register(f.key)}>
                  <option value="">Select {f.label.toLowerCase()}</option>
                  {(f.type === "patient"
                    ? db.patients
                    : db.staff.filter((s) =>
                        f.type === "technician"
                          ? s.role === "Laboratory Technician"
                          : s.role === "Dentist",
                      )
                  ).map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} · {r.id}
                    </option>
                  ))}
                </select>
              ) : f.options ? (
                <select {...register(f.key)}>
                  {f.options.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  {...register(f.key)}
                  step={f.type === "number" ? "1" : undefined}
                  multiple={f.type === "file"}
                  accept={
                    f.type === "file" ? ".pdf,.png,.jpg,.jpeg,.stl" : undefined
                  }
                />
              )}{" "}
              {f.type === "file" && (
                <small>
                  File names are stored locally. File contents are not uploaded
                  or retained.
                </small>
              )}
              {errors[f.key] && (
                <span className="field-error">
                  {str(errors[f.key]?.message)}
                </span>
              )}
            </label>
          ))}
          <label>
            <span>Status</span>
            <select {...register("status")}>
              {statuses[mod]?.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          {mod === "billing" && chosen.length > 0 && (
            <div className="invoice-quantities full">
              <h3>Item quantities</h3>
              {chosen.map((id) => (
                <label key={id}>
                  <span>{db.procedures.find((p) => p.id === id)?.name}</span>
                  <input
                    aria-label={
                      "Quantity for " +
                      db.procedures.find((p) => p.id === id)?.name
                    }
                    type="number"
                    min="1"
                    max="10000"
                    step="1"
                    value={quantities[id] ?? 1}
                    onChange={(e) =>
                      setQuantities({
                        ...quantities,
                        [id]: Number(e.target.value),
                      })
                    }
                  />
                </label>
              ))}
            </div>
          )}
          {mod === "prescriptions" && (
            <div className="additional-medications full">
              {extraMeds.map((m, i) => (
                <div className="additional-medication" key={i}>
                  <h3>Medication {i + 2}</h3>
                  <div className="form-grid">
                    {[
                      "medication",
                      "strength",
                      "dosage",
                      "route",
                      "frequency",
                      "duration",
                      "quantity",
                    ].map((k) => (
                      <label key={k}>
                        <span>{k.charAt(0).toUpperCase() + k.slice(1)} *</span>
                        <input
                          required
                          type={k === "quantity" ? "number" : "text"}
                          min={k === "quantity" ? 1 : undefined}
                          value={m[k] || ""}
                          onChange={(e) =>
                            setExtraMeds(
                              extraMeds.map((r, j) =>
                                j === i ? { ...r, [k]: e.target.value } : r,
                              ),
                            )
                          }
                        />
                      </label>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setExtraMeds(extraMeds.filter((_, j) => i !== j))
                    }
                  >
                    Remove medication
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setExtraMeds([...extraMeds, { quantity: "1", route: "Oral" }])
                }
              >
                <Plus size={15} />
                Add another medication
              </Button>
            </div>
          )}
          {["billing", "treatment-plans"].includes(mod) && (
            <div className="calculation full">
              <span>
                Subtotal <b>{c.money(subtotal)}</b>
              </span>
              {mod === "billing" && (
                <span>
                  Discount <b>− {c.money(discount)}</b>
                </span>
              )}
              <strong>
                Estimated total{" "}
                <b>{c.money(Math.max(0, subtotal - discount))}</b>
              </strong>
            </div>
          )}
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="modal-actions">
          <Button type="button" variant="outline" onClick={c.onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Check size={16} />
            Save {row ? "changes" : "record"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
function Detail(c: Ctx & { section: string; id: string }) {
  const r = c.db[c.section].find((r) => r.id === c.id);
  return r ? (
    <>
      <Link className="back-link" href={"/" + c.section}>
        <ChevronLeft size={16} />
        Back to {modules.find((m) => m[0] === c.section)?.[1]}
      </Link>
      {c.section === "patients" ? (
        <PatientDetail {...c} row={r} />
      ) : c.section === "laboratory" ? (
        <LabDetail {...c} row={r} />
      ) : (
        <InvoiceDetail {...c} row={r} />
      )}
    </>
  ) : (
    <div className="empty">
      <h2>We couldn’t find this record.</h2>
      <Link href={"/" + c.section}>Back to records</Link>
    </div>
  );
}
function RecordView(
  c: Ctx & { module: string; row: Row; onClose: () => void },
) {
  const { module: mod, row: r } = c;
  return (
    <Modal open onClose={c.onClose} title={r.name || r.id}>
      <div className="print-document">
        <div className="print-only">
          <h2>{c.settings.business}</h2>
          <p>DEMONSTRATION ONLY — NOT VALID FOR CLINICAL USE</p>
        </div>
        <div className="detail-top">
          <span className="mono">{r.id}</span>
          <Badge value={r.status} />
        </div>
        <dl className="detail-grid">
          {Object.entries(r)
            .filter(
              ([k]) =>
                !["name", "id", "status", "history", "payments"].includes(k),
            )
            .map(([k, v]) => (
              <div key={k}>
                <dt>{k.replace(/([A-Z])/g, " $1")}</dt>
                <dd>
                  {k === "patient" ? (
                    <Link href={"/patients/" + v}>{c.patientName(v)}</Link>
                  ) : k === "professional" ? (
                    c.staffName(v)
                  ) : [
                      "price",
                      "total",
                      "subtotal",
                      "discount",
                      "paid",
                    ].includes(k) ? (
                    c.money(Number(v))
                  ) : Array.isArray(v) ? (
                    v
                      .map((x) =>
                        k === "extraMeds"
                          ? Object.entries(JSON.parse(x))
                              .map(([a, b]) => a + ": " + b)
                              .join(" · ")
                          : c.db.procedures.find((p) => p.id === x)?.name || x,
                      )
                      .join("\n")
                  ) : (
                    str(v) || "Not recorded"
                  )}
                </dd>
              </div>
            ))}
        </dl>
      </div>
      <div className="modal-actions">
        {mod === "prescriptions" && (
          <Button variant="outline" onClick={() => window.print()}>
            <Printer size={16} />
            Print demo
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => {
            c.onClose();
            c.edit(mod, r);
          }}
        >
          Edit record
        </Button>
        {mod === "appointments" && (
          <Button onClick={() => c.update(mod, r, "Completed")}>
            Mark completed
          </Button>
        )}
        {mod === "treatment-plans" && (
          <select
            aria-label="Update plan status"
            value={r.status}
            onChange={(e) => c.update(mod, r, e.target.value)}
          >
            {statuses[mod].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}
        {mod === "dental-records" && r.status === "Draft" && (
          <>
            <Button
              variant="outline"
              onClick={() => c.update(mod, r, "Cancelled")}
            >
              Cancel draft
            </Button>
            <Button onClick={() => c.update(mod, r, "Finalized")}>
              Finalize demo record
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
function PatientDetail(c: Ctx & { row: Row }) {
  const r = c.row,
    [tab, setTab] = useState("Overview");
  const tabs = [
    "Overview",
    "Personal Information",
    "Medical History",
    "Dental History",
    "Dental Chart",
    "Treatment Plans",
    "Procedures",
    "Prescriptions",
    "Laboratory Orders",
    "Appointments",
    "Billing",
    "Clinical Notes",
    "Activity History",
  ];
  const linked = (m: string) => c.db[m].filter((x) => x.patient === r.id);
  const visits = linked("dental-records");
  const balance = linked("billing")
    .filter((x) => x.status !== "Cancelled")
    .reduce((s, x) => s + amount(x, "total") - amount(x, "paid"), 0);
  const next = linked("appointments")
    .filter(
      (a) =>
        a.date >= today() && !["Cancelled", "Completed"].includes(a.status),
    )
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const mapped: Record<string, string> = {
    "Treatment Plans": "treatment-plans",
    Prescriptions: "prescriptions",
    "Laboratory Orders": "laboratory",
    Appointments: "appointments",
    Billing: "billing",
    "Clinical Notes": "dental-records",
    "Activity History": "activity",
  };
  function linkedCard(mod: string, title: string) {
    const rows = linked(mod);
    return (
      <Card
        title={title}
        action={
          mod !== "activity" && (
            <button
              className="text-link"
              onClick={() => c.edit(mod, undefined, r.id)}
            >
              <Plus size={14} />
              Add
            </button>
          )
        }
      >
        <div className="linked-list">
          {rows.length ? (
            rows.map((x) => (
              <button
                key={x.id}
                onClick={() =>
                  mod === "activity"
                    ? c.notify(x.name + " · " + x.date)
                    : c.openRow(mod, x)
                }
              >
                <div>
                  <b>{x.name}</b>
                  <small>
                    {x.id} · {x.date}
                  </small>
                </div>
                <Badge
                  value={mod === "billing" ? invoiceStatus(x) : x.status}
                />
                <ChevronRight size={15} />
              </button>
            ))
          ) : (
            <div className="empty">No {title.toLowerCase()} yet.</div>
          )}
        </div>
      </Card>
    );
  }
  return (
    <>
      <section className="patient-banner">
        <Avatar name={r.name} />
        <div>
          <h2>
            {r.name} <Badge value={r.status} />
          </h2>
          <p>
            {r.id} <span>·</span> {r.phone} <span>·</span> {r.email}
          </p>
        </div>
        <div className="heading-actions">
          <Button variant="outline" onClick={() => c.edit("patients", r)}>
            Edit Patient
          </Button>
          <Button onClick={() => c.edit("appointments", undefined, r.id)}>
            <CalendarDays size={16} />
            Schedule Appointment
          </Button>
          <MenuDrop>
            <Action onClick={() => c.edit("dental-records", undefined, r.id)}>
              Add dental record
            </Action>
            <Action
              onClick={() =>
                c.confirm("Archive this patient?", () =>
                  c.update("patients", r, "Archived"),
                )
              }
            >
              Archive patient
            </Action>
          </MenuDrop>
        </div>
      </section>
      <div className="stats-grid">
        <Stat
          label="Total visits"
          value={visits.length}
          note="recorded encounters"
          icon={HeartPulse}
        />
        <Stat
          label="Next appointment"
          value={next?.date || "Not scheduled"}
          note={next ? str(next.time) : "Let’s keep care moving"}
          icon={CalendarDays}
        />
        <Stat
          label="Completed treatments"
          value={
            linked("treatment-plans").filter((x) => x.status === "Completed")
              .length
          }
          note="treatment plans"
          icon={CheckCircle2}
        />
        <Stat
          label="Outstanding balance"
          value={c.money(balance)}
          note="simulated invoices"
          icon={Wallet}
        />
      </div>
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
            key={t}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Overview" ? (
        <>
          <div className="clinical-alert">
            <ShieldCheck size={20} />
            <div>
              <b>Clinical alert · Allergies</b>
              <p>
                {str(r.allergies) || "None recorded"} · Review before each
                encounter.
              </p>
            </div>
          </div>
          <div className="detail-two">
            {linkedCard("dental-records", "Recent clinical notes")}
            {linkedCard("treatment-plans", "Treatment plans")}
            {linkedCard("appointments", "Appointments")}
            {linkedCard("laboratory", "Laboratory orders")}
            {linkedCard("billing", "Billing")}
            <Card title="Patient information">
              <dl className="detail-grid">
                {["dob", "phone", "email", "address", "emergency"].map((k) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{str(r[k]) || "Not recorded"}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </>
      ) : tab === "Dental Chart" ? (
        <DentalChart {...c} patient={r.id} />
      ) : tab === "Medical History" ||
        tab === "Dental History" ||
        tab === "Personal Information" ? (
        <Card
          title={tab}
          action={
            <Button variant="outline" onClick={() => c.edit("patients", r)}>
              Edit information
            </Button>
          }
        >
          <dl className="detail-grid">
            {(tab === "Medical History"
              ? ["history", "allergies", "medications"]
              : tab === "Dental History"
                ? ["dentalHistory", "notes"]
                : [
                    "name",
                    "dob",
                    "sex",
                    "phone",
                    "email",
                    "address",
                    "emergency",
                  ]
            ).map((k) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{str(r[k]) || "Not recorded"}</dd>
              </div>
            ))}
          </dl>
        </Card>
      ) : tab === "Procedures" ? (
        <Card title="Recorded procedures">
          <div className="linked-list">
            {visits.length ? (
              visits.map((v) => (
                <button
                  key={v.id}
                  onClick={() => c.openRow("dental-records", v)}
                >
                  <div>
                    <b>{str(v.treatment) || v.name}</b>
                    <small>
                      {v.date} · Teeth {v.teeth}
                    </small>
                  </div>
                  <Badge value={v.status} />
                </button>
              ))
            ) : (
              <div className="empty">No completed procedures recorded yet.</div>
            )}
          </div>
        </Card>
      ) : mapped[tab] ? (
        linkedCard(mapped[tab], tab)
      ) : null}
    </>
  );
}
function DentalChart(c: Ctx & { patient: string }) {
  const [system, setSystem] = useState("FDI"),
    [selected, setSelected] = useState<number[]>([]),
    [condition, setCondition] = useState("Healthy"),
    [notes, setNotes] = useState("");
  const upper = [
      18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
    ],
    lower = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
  const all = [...upper, ...[...lower].reverse()];
  const conditions = [
    "Healthy",
    "Caries",
    "Restoration",
    "Missing",
    "Crown",
    "Implant",
  ];
  function label(n: number) {
    return system === "FDI" ? n : all.indexOf(n) + 1;
  }
  function finding(n: number) {
    return c.db.findings
      .filter((r) => r.patient === c.patient && r.tooth === n)
      .at(-1);
  }
  return (
    <Card
      title="Interactive dental chart"
      subtitle="Adult permanent dentition · Select one or more teeth to record a finding."
      action={
        <select
          aria-label="Tooth numbering system"
          value={system}
          onChange={(e) => setSystem(e.target.value)}
        >
          <option>FDI</option>
          <option>Universal</option>
        </select>
      }
    >
      <div className="chart-layout">
        <div className="dental-chart">
          <div className="dental-orientation">
            <span>PATIENT RIGHT</span>
            <span>UPPER ARCH</span>
            <span>PATIENT LEFT</span>
          </div>
          {[upper, lower].map((arch, a) => (
            <div className={"tooth-row " + (a ? "lower" : "")} key={a}>
              {arch.map((n, i) => {
                const f = finding(n);
                return (
                  <button
                    key={n}
                    aria-label={`Tooth ${label(n)}, ${f?.status || "Healthy"}`}
                    aria-pressed={selected.includes(n)}
                    className={
                      "tooth " +
                      (selected.includes(n) ? "selected " : "") +
                      (f?.status || "Healthy").toLowerCase()
                    }
                    style={{
                      marginTop: `${a ? 0 : Math.abs(7.5 - i) * 3}px`,
                      marginBottom: `${a ? Math.abs(7.5 - i) * 3 : 0}px`,
                    }}
                    onClick={() =>
                      setSelected((s) =>
                        s.includes(n) ? s.filter((t) => t !== n) : [...s, n],
                      )
                    }
                  >
                    <span>{label(n)}</span>
                    <svg viewBox="0 0 40 60" aria-hidden="true">
                      <path d="M8 7 Q20 0 32 7 Q38 16 33 30 L29 52 Q26 62 22 39 Q20 34 18 39 Q14 62 11 52 L7 30 Q2 16 8 7Z" />
                      <path
                        d="M11 13 Q20 20 29 13 M20 16 L20 29"
                        className="tooth-detail"
                      />
                    </svg>
                    <i />
                  </button>
                );
              })}
            </div>
          ))}
          <div className="dental-orientation">
            <span />
            <span>LOWER ARCH</span>
            <span />
          </div>
          <div className="dental-legend">
            {conditions.map((s) => (
              <span key={s}>
                <i className={s.toLowerCase()} />
                {s}
              </span>
            ))}
          </div>
        </div>
        <aside className="tooth-panel">
          <h3>
            {selected.length
              ? `Tooth ${selected.map(label).join(", ")}`
              : "Select a tooth"}
          </h3>
          <p>View its history or add a demonstration finding.</p>
          {selected.length > 0 && (
            <>
              <label>
                Condition
                <select
                  aria-label="Condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  {conditions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                Tooth-specific notes
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </label>
              <Button
                onClick={() => {
                  selected.forEach((n) =>
                    c.save("findings", {
                      id: crypto.randomUUID(),
                      name: `Tooth ${n} finding`,
                      patient: c.patient,
                      tooth: n,
                      status: condition,
                      date: today(),
                      notes,
                    }),
                  );
                  setNotes("");
                }}
              >
                <Plus size={15} />
                Add finding
              </Button>
              <h4>Recorded findings</h4>
              {c.db.findings
                .filter(
                  (r) =>
                    r.patient === c.patient &&
                    selected.includes(Number(r.tooth)),
                )
                .map((r) => (
                  <div className="finding" key={r.id}>
                    <b>
                      {r.tooth} · {r.status}
                    </b>
                    <p>{r.notes}</p>
                    <small>{r.date}</small>
                  </div>
                ))}
              <h4>Procedure history</h4>
              {c.db["dental-records"]
                .filter(
                  (r) =>
                    r.patient === c.patient &&
                    selected.some((n) => str(r.teeth).includes(String(n))),
                )
                .map((r) => (
                  <div className="finding" key={r.id}>
                    <b>{r.name}</b>
                    <p>{r.treatment}</p>
                    <small>{r.date}</small>
                  </div>
                ))}
            </>
          )}
        </aside>
      </div>
    </Card>
  );
}
function LabDetail(c: Ctx & { row: Row }) {
  const r = c.row;
  const [note, setNote] = useState("");
  const current = workflow.indexOf(r.status);
  return (
    <>
      <div className="detail-actions">
        <Badge value={r.status} />
        <Badge value={str(r.priority)} />
        <Button variant="outline" onClick={() => c.edit("laboratory", r)}>
          Edit order
        </Button>
        {current >= 0 && current < 7 && (
          <Button
            onClick={() => c.update("laboratory", r, workflow[current + 1])}
          >
            Advance to {workflow[current + 1]}
            <ArrowRight size={15} />
          </Button>
        )}
      </div>
      <Card
        title="Production journey"
        subtitle="Every step, from first impression to delivery."
      >
        <div className="workflow-tracker">
          {workflow.map((s, i) => (
            <div className={i <= current ? "done" : ""} key={s}>
              <span>{i < current ? <Check size={16} /> : i + 1}</span>
              <b>{s}</b>
            </div>
          ))}
        </div>
      </Card>
      <div className="detail-two">
        <Card title="Work specifications">
          <dl className="detail-grid">
            {[
              "patient",
              "professional",
              "technician",
              "material",
              "shade",
              "teeth",
              "impression",
              "date",
              "due",
              "price",
              "attachments",
            ].map((k) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>
                  {k === "patient" ? (
                    <Link href={"/patients/" + r.patient}>
                      {c.patientName(r.patient)}
                    </Link>
                  ) : ["professional", "technician"].includes(k) ? (
                    c.staffName(r[k])
                  ) : k === "price" ? (
                    c.money(amount(r, k))
                  ) : (
                    str(r[k]) || "Not recorded"
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card title="Order activity">
          <div className="activity-list">
            {((r.history as string[]) || []).map((h, i) => (
              <div className="activity-item" key={i}>
                <span>
                  <Check size={15} />
                </span>
                <div>
                  <b>{h}</b>
                  <p>Simulated workflow update</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Production notes">
          <p className="prose">{r.notes}</p>
          <label>
            Add technical note
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </label>
          <Button
            disabled={!note.trim()}
            onClick={() => {
              c.save("laboratory", {
                ...r,
                notes: str(r.notes) + "\n" + note,
                history: [
                  ...((r.history as string[]) || []),
                  `${today()} · Technical note added`,
                ],
              });
              setNote("");
            }}
          >
            Save technical note
          </Button>
        </Card>
        <Card
          title="Quality control"
          subtitle="Record a demonstration inspection result."
        >
          <p className="prose">
            {str(r.qc) || "No inspection result recorded."}
          </p>
          <div className="heading-actions">
            <Button
              variant="outline"
              onClick={() =>
                c.save("laboratory", {
                  ...r,
                  qc: "Passed · " + today(),
                  history: [
                    ...((r.history as string[]) || []),
                    `${today()} · Quality control passed`,
                  ],
                })
              }
            >
              Mark passed
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                c.save("laboratory", {
                  ...r,
                  qc: "Adjustment needed · " + today(),
                  status: "Awaiting Adjustment",
                  history: [
                    ...((r.history as string[]) || []),
                    `${today()} · Adjustment requested`,
                  ],
                })
              }
            >
              Request adjustment
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
function InvoiceDetail(c: Ctx & { row: Row }) {
  const r = c.row;
  const [payment, setPayment] = useState(false),
    [value, setValue] = useState(""),
    [method, setMethod] = useState("Bank transfer"),
    [error, setError] = useState("");
  const balance = Math.max(0, amount(r, "total") - amount(r, "paid"));
  const [receipt, setReceipt] = useState(false);
  return (
    <>
      <div className="detail-actions">
        <Badge value={invoiceStatus(r)} />
        <Button variant="outline" onClick={() => c.edit("billing", r)}>
          Edit invoice
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setReceipt(false);
            setTimeout(() => window.print(), 50);
          }}
        >
          <Printer size={16} />
          Print invoice
        </Button>
        <Button
          variant="outline"
          disabled={!amount(r, "paid")}
          onClick={() => {
            setReceipt(true);
            setTimeout(() => window.print(), 50);
          }}
        >
          Print receipt
        </Button>
        <Button
          disabled={!balance || r.status === "Cancelled"}
          onClick={() => setPayment(true)}
        >
          <Plus size={16} />
          Record demo payment
        </Button>
      </div>
      <div className="invoice print-document">
        <div className="invoice-header">
          <div>
            <div className="brand-mark">
              <Smile />
            </div>
            <h2>{c.settings.business}</h2>
            <p>Dental care & prosthetics</p>
          </div>
          <div>
            <span className="eyebrow">
              {receipt ? "PAYMENT RECEIPT" : "INVOICE"}
            </span>
            <h2>{r.id}</h2>
            <p>
              Issued {r.date} · Due {r.due}
            </p>
          </div>
        </div>
        <div className="invoice-bill">
          <div>
            <small>BILL TO</small>
            <h3>{c.patientName(r.patient)}</h3>
            <p>{c.db.patients.find((p) => p.id === r.patient)?.email}</p>
            <Link href={"/patients/" + r.patient}>{r.patient}</Link>
          </div>
          <span className="demo-stamp">
            DEMONSTRATION ONLY
            <br />
            NO REAL TRANSACTION
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>DESCRIPTION</th>
              <th>QUANTITY</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {((r.items as string[]) || []).map((id, i) => {
              const p = c.db.procedures.find((x) => x.id === id);
              return (
                <tr key={id + i}>
                  <td>{p?.name || id}</td>
                  <td>{((r.itemQuantities as string[]) || [])[i] || 1}</td>
                  <td>
                    {c.money(
                      Number(
                        ((r.itemPrices as string[]) || [])[i] ??
                          amount(p || ({} as Row), "price"),
                      ) *
                        Number(((r.itemQuantities as string[]) || [])[i] || 1),
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="invoice-totals">
          <p>
            Subtotal <b>{c.money(amount(r, "subtotal"))}</b>
          </p>
          <p>
            Discount <b>− {c.money(amount(r, "discount"))}</b>
          </p>
          <h3>
            Total <b>{c.money(amount(r, "total"))}</b>
          </h3>
          <p>
            Payments received <b>{c.money(amount(r, "paid"))}</b>
          </p>
          <h3>
            Balance due <b>{c.money(balance)}</b>
          </h3>
        </div>
        <div className="invoice-foot">
          <h3>Payment history</h3>
          {((r.payments as string[]) || []).length ? (
            (r.payments as string[]).map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p>No payments recorded.</p>
          )}
          <small>
            This is a fictional invoice for demonstration purposes. Payments are
            simulated locally.
          </small>
        </div>
      </div>
      <Modal
        open={payment}
        onClose={() => setPayment(false)}
        title="Record simulated payment"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const n = Number(value);
            if (
              !Number.isFinite(n) ||
              n <= 0 ||
              Math.round(n * 100) > Math.round(balance * 100)
            ) {
              setError(
                "Enter an amount greater than zero and no more than the balance.",
              );
              return;
            }
            const paid =
              (Math.round(amount(r, "paid") * 100) + Math.round(n * 100)) / 100;
            const next = {
              ...r,
              paid,
              payments: [
                ...((r.payments as string[]) || []),
                `${today()} · ${c.money(n)} · ${method} (simulated)`,
              ],
            };
            next.status = invoiceStatus(next);
            c.save("billing", next);
            setPayment(false);
            setValue("");
          }}
        >
          <p className="prose">
            Outstanding balance: <b>{c.money(balance)}</b>
          </p>
          <label>
            Payment amount (NGN)
            <input
              type="number"
              min="0.01"
              step="0.01"
              max={balance}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </label>
          <label>
            Payment method
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option>Bank transfer</option>
              <option>Cash</option>
              <option>Card</option>
            </select>
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPayment(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Record demo payment</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
function Notifications(c: Ctx) {
  const [category, setCategory] = useState("All"),
    [unread, setUnread] = useState(false);
  const rows = c.db.notifications.filter(
    (r) =>
      (category === "All" || r.category === category) &&
      (!unread || r.status === "Unread"),
  );
  return (
    <Card
      title="Your notification center"
      subtitle="Local demonstration alerts. No external messages are sent."
      action={
        <Button
          variant="outline"
          onClick={() =>
            c.db.notifications
              .filter((r) => r.status === "Unread")
              .forEach((r) => c.update("notifications", r, "Read"))
          }
        >
          <Check size={16} />
          Mark all as read
        </Button>
      }
    >
      <div className="filter-bar">
        <select
          aria-label="Notification category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {["All", "Appointments", "Laboratory", "Billing", "Follow-up"].map(
            (s) => (
              <option key={s}>{s}</option>
            ),
          )}
        </select>
        <label className="inline-label">
          <input
            type="checkbox"
            checked={unread}
            onChange={(e) => setUnread(e.target.checked)}
          />
          Unread only
        </label>
      </div>
      <div className="notifications-list">
        {rows.length ? (
          rows.map((r) => (
            <div className={r.status === "Unread" ? "unread" : ""} key={r.id}>
              <span className="notification-icon">
                <Bell size={20} />
              </span>
              <div>
                <h3>
                  {r.name} {r.status === "Unread" && <i />}
                </h3>
                <p>{r.notes}</p>
                <small>
                  {r.category} · {r.date} · {c.patientName(r.patient)}
                </small>
              </div>
              <div className="notification-actions">
                <button
                  className="text-link"
                  onClick={() =>
                    c.update(
                      "notifications",
                      r,
                      r.status === "Unread" ? "Read" : "Unread",
                    )
                  }
                >
                  {r.status === "Unread" ? "Mark read" : "Mark unread"}
                </button>
                <button
                  className="text-link"
                  onClick={() =>
                    c.openRow(
                      "patients",
                      c.db.patients.find((p) => p.id === r.patient)!,
                    )
                  }
                >
                  View patient <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty">
            <CheckCircle2 />
            <h3>You’re all caught up.</h3>
          </div>
        )}
      </div>
    </Card>
  );
}
function Reports(c: Ctx) {
  const [from, setFrom] = useState(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 5,
        1,
      ).toLocaleDateString("en-CA"),
    ),
    [to, setTo] = useState(today());
  const inRange = (r: Row) => r.date >= from && r.date <= to;
  const patients = c.db.patients.filter(inRange),
    appointments = c.db.appointments.filter(inRange),
    lab = c.db.laboratory.filter(inRange),
    invoices = c.db.billing.filter(inRange);
  return (
    <>
      <div className="report-toolbar">
        <label>
          From
          <input
            aria-label="Report start date"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <label>
          To
          <input
            aria-label="Report end date"
            type="date"
            min={from}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
        <Button
          variant="outline"
          onClick={() =>
            exportCSV(
              [...patients, ...appointments, ...lab, ...invoices],
              "practice-report",
            )
          }
        >
          <Download size={16} />
          Export report
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer size={16} />
          Print report
        </Button>
      </div>
      {from > to && (
        <p className="form-error">Choose an end date after the start date.</p>
      )}
      <div className="stats-grid">
        <Stat
          label="New patients"
          value={patients.length}
          note="in selected period"
        />
        <Stat
          label="Appointments attended"
          value={
            appointments.filter((r) =>
              ["Completed", "Checked In"].includes(r.status),
            ).length
          }
          note={`of ${appointments.length} appointments`}
          icon={CalendarDays}
        />
        <Stat
          label="Payments received"
          value={c.money(invoices.reduce((s, r) => s + amount(r, "paid"), 0))}
          note="simulated invoice payments"
          icon={Wallet}
        />
        <Stat
          label="Outstanding balance"
          value={c.money(
            invoices
              .filter((r) => r.status !== "Cancelled")
              .reduce((s, r) => s + amount(r, "total") - amount(r, "paid"), 0),
          )}
          note="in selected period"
          icon={CreditCard}
        />
      </div>
      <div className="detail-two">
        <Card
          title="Patient registrations"
          subtitle="Synthetic demonstration data"
        >
          <TrendChart data={monthly(patients)} />
        </Card>
        <Card
          title="Revenue trends"
          subtitle="Payments on invoices issued in selected period"
        >
          <TrendChart data={monthly(invoices, (r) => amount(r, "paid"))} bar />
        </Card>
        <Card title="Appointment attendance">
          <TrendChart
            data={[
              "Completed",
              "Confirmed",
              "Checked In",
              "Cancelled",
              "No Show",
            ].map((s) => ({
              name: s,
              value: appointments.filter((r) => r.status === s).length,
            }))}
            bar
          />
        </Card>
        <Card title="Laboratory workload">
          <TrendChart
            data={[
              "In Production",
              "Quality Control",
              "Ready for Delivery",
              "Delivered",
            ].map((s) => ({
              name: s,
              value: lab.filter((r) => r.status === s).length,
            }))}
            bar
          />
        </Card>
        <Card title="Procedure distribution">
          <div className="care-metrics">
            {c.db.procedures.map((p) => {
              const n = c.db["treatment-plans"]
                .filter(inRange)
                .filter((r) =>
                  ((r.procedures as string[]) || []).includes(p.id),
                ).length;
              return n ? (
                <div key={p.id}>
                  <span>{p.name}</span>
                  <b>{n}</b>
                </div>
              ) : null;
            })}
          </div>
        </Card>
        <Card
          title="Laboratory turnaround"
          subtitle="Planned turnaround from received date to due date"
        >
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>WORK TYPE</th>
                  <th>PLANNED DAYS</th>
                </tr>
              </thead>
              <tbody>
                {lab.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <Link href={"/laboratory/" + r.id}>{r.id}</Link>
                    </td>
                    <td>{r.name}</td>
                    <td>
                      {Math.max(
                        0,
                        Math.round(
                          (new Date(str(r.due)).getTime() -
                            new Date(r.date).getTime()) /
                            86400000,
                        ),
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
function SettingsPage({
  values,
  onSave,
  onReset,
}: {
  values: Record<string, string>;
  onSave: (v: Record<string, string>) => void;
  onReset: () => void;
}) {
  const [tab, setTab] = useState("General"),
    [draft, setDraft] = useState(values);
  const groups: Record<string, [string, string, string[]?][]> = {
    General: [
      ["business", "Business name"],
      ["email", "Contact email"],
      ["phone", "Contact phone"],
      ["address", "Business address"],
      ["currency", "Currency", ["NGN"]],
      [
        "timezone",
        "Time zone",
        ["Africa/Lagos", "America/Los_Angeles", "Europe/London", "UTC"],
      ],
      [
        "demoRole",
        "Simulated role (no security enforcement)",
        [
          "Administrator",
          "Dentist",
          "Dental Assistant",
          "Laboratory Technician",
          "Receptionist",
          "Accountant",
        ],
      ],
    ],
    Appearance: [
      ["color", "Primary brand color"],
      ["theme", "Interface theme", ["Light", "Dark"]],
      ["sidebar", "Sidebar preference", ["Expanded", "Collapsed"]],
    ],
    "Clinic preferences": [
      ["working", "Working hours"],
      ["duration", "Default appointment duration"],
      ["appointmentTypes", "Appointment types"],
      ["calendar", "Default calendar view", ["Week", "Day", "Month"]],
    ],
    Laboratory: [
      ["orderPrefix", "Order numbering prefix"],
      ["workTypes", "Available work types"],
      ["turnaround", "Target turnaround (days)"],
      ["priority", "Default priority", ["Normal", "High", "Low"]],
    ],
    Billing: [
      ["invoicePrefix", "Invoice numbering prefix"],
      ["currency", "Currency", ["NGN"]],
      ["terms", "Payment terms"],
      ["receipt", "Receipt preference", ["Printable preview", "None"]],
    ],
    Notifications: [
      [
        "reminders",
        "Appointment reminder preference",
        ["Enabled (demo)", "Disabled"],
      ],
      ["labAlerts", "Laboratory alerts", ["Enabled (demo)", "Disabled"]],
      [
        "paymentAlerts",
        "Payment reminder preference",
        ["Enabled (demo)", "Disabled"],
      ],
    ],
  };
  return (
    <div className="settings-layout">
      <aside>
        {Object.keys(groups).map((s) => (
          <button
            key={s}
            className={tab === s ? "active" : ""}
            onClick={() => setTab(s)}
          >
            {s}
            <ChevronRight size={15} />
          </button>
        ))}
      </aside>
      <div>
        <Card
          title={tab + " settings"}
          subtitle="Preferences stay on this device. Scheduling, numbering and alert preferences are demonstration configuration."
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave(draft);
            }}
          >
            <div className="form-grid">
              {groups[tab].map(([key, label, options]) => (
                <label key={key}>
                  <span>{label}</span>
                  {options ? (
                    <select
                      value={draft[key] || options[0]}
                      onChange={(e) =>
                        setDraft({ ...draft, [key]: e.target.value })
                      }
                    >
                      {options.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={
                        key === "color"
                          ? "color"
                          : key === "email"
                            ? "email"
                            : "text"
                      }
                      required={["business", "color"].includes(key)}
                      value={draft[key] || ""}
                      onChange={(e) =>
                        setDraft({ ...draft, [key]: e.target.value })
                      }
                    />
                  )}
                </label>
              ))}
            </div>
            {tab === "Appearance" && (
              <label className="logo-upload">
                Practice logo (PNG or JPEG, up to 500 KB)
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 500000) {
                      e.target.setCustomValidity(
                        "Choose an image smaller than 500 KB.",
                      );
                      e.target.reportValidity();
                      return;
                    }
                    e.target.setCustomValidity("");
                    const reader = new FileReader();
                    reader.onload = () =>
                      setDraft({ ...draft, logo: String(reader.result) });
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            )}
            {tab === "Appearance" && (
              <div className="logo-preview">
                <div className="brand-mark" style={{ background: draft.color }}>
                  {draft.logo ? (
                    <img src={draft.logo} alt="Practice logo preview" />
                  ) : (
                    <Smile />
                  )}
                </div>
                <strong>{draft.business}</strong>
                <small>Brand preview · dental icon</small>
              </div>
            )}
            {tab === "Notifications" && (
              <p className="prose">
                These settings simulate preferences. This frontend does not send
                notifications, email, or messages.
              </p>
            )}
            <div className="modal-actions">
              <Button type="submit">
                <Check size={16} />
                Save preferences
              </Button>
            </div>
          </form>
        </Card>
        <Card
          title="Demo data"
          subtitle="Start fresh with the original fictional practice records."
        >
          <div className="reset-row">
            <p>Resetting removes records and edits saved in this browser.</p>
            <Button variant="destructive" onClick={onReset}>
              Reset demo data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
