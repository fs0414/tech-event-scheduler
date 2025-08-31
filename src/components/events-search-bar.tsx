"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn, UI_CONSTANTS } from "@/lib/ui-constants";

interface EventsSearchBarProps {
  initialSearch?: string;
}

export default function EventsSearchBar({
  initialSearch = "",
}: EventsSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="relative max-w-md">
      <Search
        className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
          UI_CONSTANTS.colors.mutedText,
        )}
      />
      <Input
        type="text"
        placeholder="イベントを検索..."
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        className={cn("pl-10", UI_CONSTANTS.transitions.default)}
      />
    </div>
  );
}
