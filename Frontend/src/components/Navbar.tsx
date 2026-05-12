import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, BarChart3, Settings, Code2, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/questions", label: "Questions", icon: BookOpen },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const isActive = (to: string) => (to === "/" ? path === "/" : path.startsWith(to));

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan to-blue-soft shadow-lg shadow-cyan/30">
            <Code2 className="h-5 w-5 text-primary-foreground" />
            <div className="absolute inset-0 rounded-xl bg-cyan/30 blur-lg -z-10 group-hover:bg-cyan/50 transition" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">DSA Tracker</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Daily streak hub</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {items.map((it) => {
            const Active = isActive(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={cn(
                  "relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                  Active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <it.icon className="h-4 w-4" />
                {it.label}
                {Active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-xl bg-white/5 border border-white/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-lg p-2 hover:bg-white/5"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {items.map((it) => (
                <Link
                  key={it.to}
                  to={it.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                    isActive(it.to)
                      ? "bg-white/8 text-foreground border border-white/10"
                      : "text-muted-foreground hover:bg-white/5",
                  )}
                >
                  <it.icon className="h-4 w-4" /> {it.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
