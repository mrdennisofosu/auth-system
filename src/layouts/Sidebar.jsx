import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import { ChevronDown, LogOut, X } from "lucide-react";
import { APP_NAME } from "../constants/app";

const itemBase =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors";

// A single link in the sidebar. NavLink knows if its page is the current one.
function SidebarLink({ item, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `${itemBase} ${
          isActive
            ? "bg-brand-50 text-brand-700"
            : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      <Icon size={18} aria-hidden="true" />
      {item.label}
    </NavLink>
  );
}

// A collapsible heading (Security, Account, Management...) with links inside.
function SidebarGroup({ group, onNavigate }) {
  const { pathname } = useLocation();
  const hasActiveChild = group.children.some((child) =>
    pathname.startsWith(child.to),
  );

  // Start open if the current page is inside this group
  const [open, setOpen] = useState(hasActiveChild);
  const Icon = group.icon;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        className={`${itemBase} w-full justify-between hover:bg-slate-100 ${
          hasActiveChild ? "text-brand-700" : "text-slate-700"
        }`}
      >
        <span className="flex items-center gap-3">
          <Icon size={18} aria-hidden="true" />
          {group.label}
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 pl-3">
          {group.children.map((child) => (
            <SidebarLink key={child.to} item={child} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

// navigation: the config list (groups and links)
// isOpen / onClose: control the drawer on phones
function Sidebar({ navigation, isOpen, onClose, onLogout }) {
  const content = (
    <div className="flex min-h-full flex-col justify-between gap-4 p-4">
      <nav aria-label="Main navigation" className="space-y-1">
        {navigation.map((item) =>
          item.children ? (
            <SidebarGroup key={item.label} group={item} onNavigate={onClose} />
          ) : (
            <SidebarLink key={item.to} item={item} onNavigate={onClose} />
          ),
        )}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className={`${itemBase} w-full text-red-600 hover:bg-red-50`}
      >
        <LogOut size={18} aria-hidden="true" />
        Logout
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop (lg and up): permanent sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          {content}
        </div>
      </aside>

      {/* Phones and tablets: drawer that opens over the page */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
              <span className="font-bold text-slate-900">{APP_NAME}</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{content}</div>
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;
