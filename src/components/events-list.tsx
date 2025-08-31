import { Calendar, ExternalLink, UserCheck, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  cn,
  createCardClasses,
  createTypographyClasses,
  UI_CONSTANTS,
} from "@/lib/ui-constants";
import type { EventForList } from "@/types/events";

interface EventsListProps {
  events: EventForList[];
}

export default function EventsList({ events }: EventsListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className={cn(
            "mb-4 text-muted-foreground",
            createTypographyClasses("l", "regular", "muted"),
          )}
        >
          イベントが見つかりませんでした
        </div>
        <div className={createTypographyClasses("m", "regular", "muted")}>
          検索条件を変更するか、新しいイベントを作成してください
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card
          key={event.id}
          className={cn(
            createCardClasses("default"),
            UI_CONSTANTS.states.hover,
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle
                className={cn(
                  createTypographyClasses("l", "bold", "primary"),
                  "line-clamp-2 min-h-[3.5rem] flex items-center",
                )}
              >
                {event.title}
              </CardTitle>
              <div className="flex-shrink-0 mt-1">
                {event.eventUrl && (
                  <a
                    href={event.eventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex p-1.5 rounded-md transition-colors",
                      UI_CONSTANTS.states.hover,
                      UI_CONSTANTS.colors.mutedText,
                      "hover:text-primary hover:bg-primary/10",
                    )}
                    aria-label="外部ページを開く"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={cn("p-1.5 rounded-md", UI_CONSTANTS.colors.accent)}
                >
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <div
                    className={createTypographyClasses("m", "bold", "primary")}
                  >
                    {event.attendance}人
                  </div>
                  <div
                    className={createTypographyClasses(
                      "xs",
                      "regular",
                      "muted",
                    )}
                  >
                    出席者
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "p-1.5 rounded-md",
                    UI_CONSTANTS.colors.secondary,
                    UI_CONSTANTS.colors.secondaryText,
                  )}
                >
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div
                    className={createTypographyClasses("m", "bold", "primary")}
                  >
                    {event.owners?.length || 0}人
                  </div>
                  <div
                    className={createTypographyClasses(
                      "xs",
                      "regular",
                      "muted",
                    )}
                  >
                    管理者
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Badges */}
            {event.owners && event.owners.length > 0 && (
              <div>
                <div
                  className={cn(
                    "mb-2",
                    createTypographyClasses("xs", "medium", "muted"),
                  )}
                >
                  管理者
                </div>
                <div className="flex flex-wrap gap-1">
                  {event.owners.slice(0, 3).map((owner) => (
                    <Badge
                      key={owner.id}
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        UI_CONSTANTS.colors.secondaryText,
                      )}
                    >
                      {owner.user.name}
                    </Badge>
                  ))}
                  {event.owners.length > 3 && (
                    <Badge
                      variant="outline"
                      className={cn("text-xs", UI_CONSTANTS.colors.mutedText)}
                    >
                      +{event.owners.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2">
              <Link
                href={`/events/${event.id}`}
                className={cn(
                  "inline-flex items-center gap-2 w-full justify-center py-2 px-4 text-sm font-medium rounded-md transition-colors",
                  UI_CONSTANTS.colors.primary,
                  UI_CONSTANTS.colors.primaryText,
                  UI_CONSTANTS.states.hover,
                  "hover:opacity-90",
                )}
              >
                <Calendar className="h-4 w-4" />
                詳細を見る
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
