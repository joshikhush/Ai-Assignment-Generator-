import React from "react";
import Link from "next/link";
import {
  Home,
  Users,
  FileText,
  Wrench,
  BookMarked,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white min-h-screen flex flex-col m-4 rounded-3xl shadow-sm overflow-hidden p-6 fixed">
      {/* Logo Section */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold pb-1 bg-gradient-to-br from-orange-400 to-red-500">
           ∨
        </div>
        <span className="font-bold text-xl tracking-tight">VedaAI</span>
      </div>

      {/* Main Action Button */}
      <Link href="/create" className="bg-[#1a1a1a] text-white py-3 px-4 rounded-full flex items-center justify-center gap-2 font-medium mb-10 hover:bg-gray-800 transition">
        <span className="text-xl leading-none">✨</span>
        <span className="text-sm">Create Assignment</span>
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        <NavItem icon={<Home size={20} />} label="Home" />
        <NavItem icon={<Users size={20} />} label="My Groups" />
        <NavItem
          icon={<FileText size={20} />}
          label="Assignments"
          active
          badge={10}
        />
        <NavItem icon={<Wrench size={20} />} label="Ai Teacher's Toolkit" />
        <NavItem icon={<BookMarked size={20} />} label="My Library" />
      </nav>

      {/* Footer Section */}
      <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-4">
        <NavItem icon={<Settings size={20} />} label="Settings" />

        {/* School Profile Card */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden">
            <span className="text-xl">👩‍🏫</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 leading-tight">Delphi Public School</span>
            <span className="text-xs text-gray-500">Bokaro Steel City</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Helper component for the navigation links
function NavItem({
  icon,
  label,
  active,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={label === "Assignments" ? "/" : "#"}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition group font-medium text-sm
        ${
          active
            ? "bg-gray-100 text-gray-900"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        }
      `}
    >
      <span className={active ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"}>
        {icon}
      </span>
      <span>{label}</span>
      {badge && (
        <span className="ml-auto bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}
