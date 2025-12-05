import { useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "../../ui/separator";
import { Dispatch, SetStateAction } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NavItems({ items, setOpen, collapsed }) {
  const path = useLocation();
  const [openIndices, setOpenIndices] = useState(
    items.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
  );

  const toggleMenu = (index) => {
    setOpenIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="space-y-1">
      {items.map((item, index) => {
        const Icon = item.icon || "arrowRight";
        const isActive =
          path.pathname.startsWith(item.href || "") ||
          item.items?.some((subItem) =>
            path.pathname.startsWith(subItem.href || "")
          );
        const isOpen = openIndices[index];

        return (
          <div key={index}>
            {item.items ? (
              <div className="relative">
                <button
                  className={cn(
                    "flex items-center justify-between w-full rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200 group select-none",
                    isActive
                      ? "bg-indigo-50/80 text-indigo-700 shadow-sm ring-1 ring-indigo-200/50"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    item.disabled && "cursor-not-allowed opacity-50",
                    collapsed && "justify-center px-2"
                  )}
                  onClick={() => !collapsed && toggleMenu(index)}
                  disabled={item.disabled}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn(
                      "h-[18px] w-[18px] transition-colors duration-200",
                      isActive ? "text-indigo-600 stroke-[2.5px]" : "text-slate-400 group-hover:text-slate-600"
                    )} />
                    {!collapsed && <span className="tracking-wide">{item.title}</span>}
                  </div>
                  {!collapsed && (
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 text-slate-400 transition-transform duration-300",
                      isOpen ? "rotate-180 text-indigo-600" : "group-hover:text-slate-600"
                    )} />
                  )}
                </button>
                {!collapsed && (
                  <div
                    className={cn(
                      "mt-1 space-y-0.5 overflow-hidden transition-all duration-300 ease-in-out",
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    {item.items.map((subItem, subIndex) => {
                      const SubIcon = subItem.icon || "arrowRight";
                      const isSubActive = path.pathname.startsWith(subItem.href || "");
                      return (
                        <Link key={subIndex} to={subItem.href || "/"}>
                          <span
                            className={cn(
                              "flex items-center gap-3 rounded-lg pl-11 pr-3 py-2 text-[13px] transition-all duration-200 relative",
                              isSubActive
                                ? "text-indigo-700 font-semibold bg-indigo-50/50"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            )}
                            onClick={() => {
                              if (setOpen) setOpen(false);
                            }}
                          >
                            {isSubActive && (
                              <span className="absolute left-[22px] w-1 h-1 rounded-full bg-indigo-600" />
                            )}
                            <span>{subItem.title}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              item.href && (
                collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        key={index}
                        to={item.disabled ? "/" : item.href}
                        onClick={() => {
                          if (setOpen) setOpen(false);
                        }}
                      >
                        <span
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 group justify-center relative",
                            path.pathname === item.href || path.pathname.startsWith(item.href)
                              ? "bg-indigo-50/80 text-indigo-700 shadow-sm ring-1 ring-indigo-200/50"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                            item.disabled && "cursor-not-allowed opacity-50"
                          )}
                        >
                          <Icon className={cn(
                            "h-[18px] w-[18px] transition-colors duration-200",
                            path.pathname === item.href || path.pathname.startsWith(item.href)
                              ? "text-indigo-600 stroke-[2.5px]"
                              : "text-slate-400 group-hover:text-slate-600"
                          )} />
                          {(path.pathname === item.href || path.pathname.startsWith(item.href)) && (
                            <span className="absolute right-1.5 top-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full border border-white" />
                          )}
                        </span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2 font-medium bg-slate-900 text-white border-0">
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    key={index}
                    to={item.disabled ? "/" : item.href}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                  >
                    <span
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200 group",
                        path.pathname === item.href ||
                          path.pathname.startsWith(item.href)
                          ? "bg-indigo-50/80 text-indigo-700 shadow-sm ring-1 ring-indigo-200/50"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        item.disabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <Icon className={cn(
                        "h-[18px] w-[18px] transition-colors duration-200",
                        path.pathname === item.href || path.pathname.startsWith(item.href)
                          ? "text-indigo-600 stroke-[2.5px]"
                          : "text-slate-400 group-hover:text-slate-600"
                      )} />
                      <span className="tracking-wide">{item.title}</span>
                    </span>
                  </Link>
                )
              )
            )}
          </div>
        );
      })}
    </nav>
  );
}
