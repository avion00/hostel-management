import { useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "../../ui/separator";
import { Dispatch, SetStateAction } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function NavItems({ items, setOpen }) {
  const path = useLocation();
  const [openIndices, setOpenIndices] = useState(
    items.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
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
    <nav className="grid items-start">
      {items.map((item, index) => {
        const Icon = item.icon || "arrowRight";
        const isActive =
          path.pathname.startsWith(item.href || "") ||
          item.items?.some((subItem) =>
            path.pathname.startsWith(subItem.href || "")
          );
        const isOpen = openIndices[index];

        return (
          <div key={index} className="text-muted-foreground">
            {item.items ? (
              <div className="relative group">
                <span
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-xs  font-medium text-black hover:bg-primary-foreground hover:text-primary cursor-pointer",
                    isActive
                      ? "bg-primary-foreground text-primary"
                      : "transparent",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                  onClick={() => toggleMenu(index)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{item.title}</span>
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </span>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "block" : "hidden"
                  )}
                >
                  {item.items.map((subItem, subIndex) => {
                    const Icon = subItem.icon || "arrowRight";
                    return (
                      <Link key={subIndex} to={subItem.href || "/"}>
                        <span
                          className={cn(
                            "ml-2 mt-2 flex items-center rounded-md px-3 py-2 text-xs text-black hover:bg-primary-foreground hover:text-primary cursor-pointer",
                            path.pathname.startsWith(subItem.href || "")
                              ? "bg-primary-foreground text-primary"
                              : ""
                          )}
                          onClick={() => {
                            if (setOpen) setOpen(false);
                          }}
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          <span className="font-medium">{subItem.title}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              item.href && (
                <Link
                  key={index}
                  to={item.disabled ? "/" : item.href}
                  onClick={() => {
                    if (setOpen) setOpen(false);
                  }}
                >
                  <span
                    className={cn(
                      "ml-2 flex items-center rounded-md px-3 py-2 text-xs font-medium text-black hover:bg-primary-foreground hover:text-primary cursor-pointer",
                      path.pathname === item.href ||
                        path.pathname.startsWith(item.href)
                        ? "bg-primary-foreground text-primary"
                        : "transparent",
                      item.disabled && "cursor-not-allowed opacity-80"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </span>
                </Link>
              )
            )}
            <Separator className="my-2 bg-white" />
          </div>
        );
      })}
    </nav>
  );
}
