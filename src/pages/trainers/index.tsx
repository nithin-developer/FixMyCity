import { useEffect, useState } from "react";
import {
  listTrainers,
  deleteTrainer,
  Trainer,
  createTrainer,
  updateTrainer,
} from "@/api/trainers";
import { Button } from "@/components/ui/button";
// removed Link navigation in favor of dialogs
import { Header } from "@/components/layout/header";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, RefreshCw } from "lucide-react";
import { TrainerFormDialog } from "./components/trainer-form-dialog";
import { TrainersTable } from "./components/trainer-table";

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<Trainer | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    listTrainers()
      .then((t) => setTrainers(t))
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteTrainer(pendingDelete.id);
      toast.success("Deleted");
      setPendingDelete(null);
      load();
    } catch {
      toast.error("Delete failed");
    }
  }

  async function handleCreate(values: any) {
    setSubmitting(true);
    try {
      await createTrainer(values);
      toast.success("Trainer created");
      setFormOpen(false);
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Creation failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(values: any) {
    if (!editingTrainer) return;
    setSubmitting(true);
    try {
      await updateTrainer(editingTrainer.id, values);
      toast.success("Updated");
      setFormOpen(false);
      setEditingTrainer(null);
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Update failed");
    } finally {
      setSubmitting(false);
    }
  }

  const openCreate = () => {
    setFormMode("create");
    setEditingTrainer(null);
    setFormOpen(true);
  };
  const openEdit = (t: Trainer) => {
    setFormMode("edit");
    setEditingTrainer(t);
    setFormOpen(true);
  };

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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Trainers</h2>
            <p className="text-sm text-muted-foreground">
              Manage your Municipal_Officer directory
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={load}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add Trainer
            </Button>
          </div>
        </div>
        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}
        {!loading && trainers && (
          <TrainersTable
            data={trainers}
            onEdit={(t) => openEdit(t)}
            onDelete={(t) => setPendingDelete(t)}
          />
        )}
      </div>
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(v) => {
          if (!v) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trainer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {pendingDelete?.fullname}? This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <TrainerFormDialog
        mode={formMode}
        open={formOpen}
        onOpenChange={(v) => {
          if (!v) {
            setFormOpen(false);
            setEditingTrainer(null);
          } else setFormOpen(true);
        }}
        onSubmit={formMode === "create" ? handleCreate : handleUpdate}
        submitting={submitting}
        defaultValues={
          formMode === "edit"
            ? {
                fullname: editingTrainer?.fullname,
                email: editingTrainer?.email,
                position: editingTrainer?.position || "",
                department: editingTrainer?.department || "",
                is_active: editingTrainer?.is_active,
              }
            : undefined
        }
      />
    </>
  );
}
