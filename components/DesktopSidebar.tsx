"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { sidebarRoutes, automationRoutes, recordsRoutes, listsRoutes } from "@/lib/data";
import UserAvailableCreditsBadge from "./UserAvailableCreditsBadge";
import { 
  Play, 
  ChevronDown, 
  ChevronRight,
  Search,
  Server,
  User,
  ArrowUp,
  CreditCard,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

function DesktopSidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState({
    automations: true,
    favorites: false,
    records: false,
    lists: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-sidebar dark:text-foreground text-muted-foreground border-r border-border/50">
      {/* Top User Section */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-foreground">Satwik</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <Server className="w-4 h-4" />
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg border border-border/50">
            <Search className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">Quick...</span>
            <div className="ml-auto flex items-center gap-1">
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</span>
              <span className="text-xs text-muted-foreground">/</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="p-2 space-y-1">
        {sidebarRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-1 rounded-lg text-sm transition-colors hover:bg-muted/50",
              pathname === route.href ? "bg-muted/50 text-foreground" : "text-muted-foreground"
            )}
          >
            <route.icon className="w-4 h-4" />
            {route.label}
          </Link>
        ))}
      </div>

      {/* Expandable Sections */}
      <div className="p-2 space-y-1">
        {/* Automations Section */}
        <div>
          <button
            onClick={() => toggleSection('automations')}
            className="flex items-center justify-between w-full px-3 py-1 rounded-lg text-sm transition-colors hover:bg-muted/50 text-muted-foreground"
          >
            <div className="flex items-center gap-3">
              <Play className="w-4 h-4" />
              Automations
            </div>
            {expandedSections.automations ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {expandedSections.automations && (
            <div className="ml-6 mt-1 space-y-1">
              {automationRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-1 rounded-lg text-sm transition-colors hover:bg-muted/50",
                    pathname === route.href ? "bg-blue-500/20 text-blue-400" : "text-muted-foreground"
                  )}
                >
                  <route.icon className="w-4 h-4" />
                  {route.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Favorites Section */}
        <div>
          <button
            onClick={() => toggleSection('favorites')}
            className="flex items-center justify-between w-full px-3 py-1 rounded-lg text-sm transition-colors hover:bg-muted/50 text-muted-foreground"
          >
            <span>Favorites</span>
            {expandedSections.favorites ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {expandedSections.favorites && (
            <div className="ml-6 mt-1 px-3 py-1 text-sm text-muted-foreground">
              No favorites
            </div>
          )}
        </div>

        {/* Records Section */}
        <div>
          <button
            onClick={() => toggleSection('records')}
            className="flex items-center justify-between w-full px-3 py-1 rounded-lg text-sm transition-colors hover:bg-muted/50 text-muted-foreground"
          >
            <span>Records</span>
            {expandedSections.records ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {expandedSections.records && (
            <div className="ml-6 mt-1 space-y-1">
              {recordsRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-1 rounded-lg text-sm transition-colors hover:bg-muted/50",
                    pathname === route.href ? "bg-blue-500/20 text-blue-400" : "text-muted-foreground"
                  )}
                >
                  <route.icon className="w-4 h-4" />
                  {route.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Lists Section */}
        <div>
          <button
            onClick={() => toggleSection('lists')}
            className="flex items-center justify-between w-full px-3 py-1 rounded-lg text-sm transition-colors hover:bg-muted/50 text-muted-foreground"
          >
            <span>Lists</span>
            {expandedSections.lists ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {expandedSections.lists && (
            <div className="ml-6 mt-1">
              <button className="flex items-center gap-2 px-3 py-1 border border-dashed border-muted-foreground/30 rounded-lg text-sm text-muted-foreground hover:border-muted-foreground/50 transition-colors">
                <Plus className="w-4 h-4" />
                New list
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DesktopSidebar;
