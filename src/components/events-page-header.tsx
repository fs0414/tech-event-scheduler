import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  cn,
  createButtonClasses,
  createTypographyClasses,
  UI_CONSTANTS,
} from "@/lib/ui-constants";
import EventsSearchBar from "./events-search-bar";

interface EventsPageHeaderProps {
  initialSearch?: string;
}

export default function EventsPageHeader({
  initialSearch,
}: EventsPageHeaderProps) {
  return (
    <div className={cn(UI_CONSTANTS.spacing.marginBottom)}>
      {/* Page Title */}
      <div className="mb-6">
        <h1
          className={cn(
            createTypographyClasses("xxl", "bold", "primary"),
            "mb-2",
          )}
        >
          イベント一覧
        </h1>
        <p className={createTypographyClasses("m", "regular", "muted")}>
          登録されたイベントを確認し、新しいイベントを作成できます
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <EventsSearchBar initialSearch={initialSearch} />

        <Button
          asChild
          className={cn(createButtonClasses("primary", "medium"), "gap-2")}
        >
          <Link href="/events/create">
            <Plus className="h-4 w-4" />
            新しいイベントを作成
          </Link>
        </Button>
      </div>
    </div>
  );
}
