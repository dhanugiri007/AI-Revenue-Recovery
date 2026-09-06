import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useCompany } from "../features/company/hooks/useCompany";

const navItems = [
  { to: "/dashboard", label: "Overview" },
  { to: "/events", label: "Recovery Cases" },
  { to: "/customers", label: "Customers" },
  { to: "/policies", label: "Policies" },
  { to: "/reviews", label: "Review Queue" },
  { to: "/company", label: "Company Settings" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { company } = useCompany();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-60 h-screen fixed left-0 top-0 bg-zinc-950 border-r border-white/10 flex flex-col">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight text-white truncate">
            {company?.name || "recover.ai"}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-xs transition-colors ${
                isActive
                  ? "bg-white/10 text-white font-medium"
                  : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 mb-2">
          <p className="text-xs font-medium text-white truncate">{user?.name}</p>
          <p className="text-[11px] text-zinc-600 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded-lg text-xs text-zinc-500 hover:bg-white/5 hover:text-white transition-colors"
        >
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;