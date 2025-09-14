import { useEffect, useState } from "react";
import { eventsApi, EventSummary } from "@/api/events";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { format } from "date-fns";
import { useAuth } from "@/stores/authStore";
import { EyeIcon, Plus, RefreshCw, Trash2, UsersIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { Search } from "@/components/search";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { ThemeSwitch } from "@/components/theme-switch";
import NoDataImg from "/public/images/no-data.svg";

export default function EventsIndexPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const role = useAuth().user?.role;
  const canCreate = role === "super_admin";
  const canEdit = role === "super_admin";
  const canDelete = role === "super_admin";

  async function load() {
    setLoading(true);
    try {
      const list = await eventsApi.list();
      setEvents(list);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    await eventsApi.delete(id);
    setDeleteId(null);
    load();
  }

  return (
    <>
      <Header>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <div className="container mx-auto p-6 space-y-6">
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Events</h2>
            <p className="text-muted-foreground">
              Manage all the events in your organization
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={load}
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4 animate-spin-once" />
            </Button>
            {canCreate && (
              <Button variant="default" asChild>
                <Plus className="h-4 w-4" />
                <Link to="/events/create">Create Event</Link>
              </Button>
            )}
          </div>
        </div>
        {loading && (
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-60 w-full" />
            ))}
          </div>
        )}

        {!loading && events && (
          <>
            {events.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                {events.map((ev) => (
                  <Card
                    key={ev.id}
                    className="group relative overflow-hidden border-border/60 hover:shadow-md transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-100 transition-opacity pointer-events-none" />
                    <CardHeader className="">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <UsersIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold">
                              {ev.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {ev.training_company}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {ev.sessions_count} sessions
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Timeframe:
                          </span>
                          <span className="font-medium">
                            {format(new Date(ev.start_date), "MMM d, yyyy")} -{" "}
                            {format(new Date(ev.end_date), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Created At:
                          </span>
                          <span className="font-medium">
                            {ev.created_at
                              ? new Date(ev.created_at).toLocaleString(
                                  "en-US",
                                  {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  }
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 ">
                        <Button size="sm" asChild>
                          <Link
                            to={`/events/${ev.id}`}
                            className="flex items-center justify-center gap-2"
                          >
                            <EyeIcon className="h-4 w-4" />
                            View
                          </Link>
                        </Button>
                        {canEdit && (
                          <Button
                            asChild
                            size="sm"
                            variant="secondary"
                            className="flex-1 hidden md:inline-flex"
                          >
                            <Link to={`/events/${ev.id}/edit`}>Edit</Link>
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteId(ev.id)}
                            className="flex items-center justify-center gap-2 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="relative mb-4">
                  <img src={NoDataImg} alt="" className="h-50 w-50 " />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Events Found
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Get started by creating your first event. You can configure
                  batches and manage their attendance efficiently for each
                  events.
                </p>
                <Button className="gap-2 px-6">
                  <Plus className="h-4 w-4" />
                  <Link to="/events/create">Create Your First Event</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <DeleteConfirmDialog
        open={!!deleteId}
        title="Delete Event"
        description="Are you sure you want to delete this event? This cannot be undone."
        confirmText="Delete"
        onConfirm={() => {
          if (deleteId) {
            return handleDelete(deleteId);
          }
        }}
        onOpenChange={(o: boolean) => {
          if (!o) setDeleteId(null);
        }}
      />
    </>
  );
}
