"use client";

import { useState, useEffect, useCallback } from "react";
import { Link2, Check, Loader2, Trash2, UserPlus, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PersonData {
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
}

interface ShareData {
  owner: PersonData & { userId: string };
  collaborators: PersonData[];
}

interface ShareDialogProps {
  projectId: string;
  isOwner: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function PersonAvatar({ email, displayName, avatarUrl }: PersonData) {
  const initial = (displayName ?? email).charAt(0).toUpperCase();
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={displayName ?? email}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
      {initial}
    </div>
  );
}

function RoleBadge({ role }: { role: "OWNER" | "COLLABORATOR" }) {
  const isOwner = role === "OWNER";
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        isOwner
          ? "border-teal-500/50 text-teal-400"
          : "border-border text-muted-foreground"
      }`}
    >
      {role}
    </span>
  );
}

export function ShareDialog({
  projectId,
  isOwner,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const [data, setData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    const email = inviteEmail.trim();
    if (!email) return;
    setInviting(true);
    setInviteError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setInviteEmail("");
        await fetchData();
      } else {
        const body = await res.json().catch(() => ({}));
        setInviteError((body as { error?: string })?.error ?? "Failed to invite");
      }
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(email: string) {
    setRemoving((prev) => new Set(prev).add(email));
    try {
      await fetch(
        `/api/projects/${projectId}/collaborators/${encodeURIComponent(email)}`,
        { method: "DELETE" }
      );
      setData((prev) =>
        prev
          ? { ...prev, collaborators: prev.collaborators.filter((c) => c.email !== email) }
          : prev
      );
    } finally {
      setRemoving((prev) => {
        const next = new Set(prev);
        next.delete(email);
        return next;
      });
    }
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/editor/${projectId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const totalCount = data ? 1 + data.collaborators.length : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            Invite collaborators, copy the workspace link, and manage access.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {/* Workspace link card */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-foreground">Workspace link</span>
              <span className="text-xs text-muted-foreground">
                Share a direct link with teammates after you grant them access.
              </span>
            </div>
            <Button
              variant="default"
              size="sm"
              className="ml-4 shrink-0"
              onClick={handleCopyLink}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy link"}
            </Button>
          </div>

          {/* Invite form — owners only */}
          {isOwner && (
            <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
              <form onSubmit={handleInvite} className="flex gap-2">
                <div className="relative flex flex-1 items-center">
                  <Mail className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="teammate@company.com"
                    value={inviteEmail}
                    onChange={(e) => {
                      setInviteEmail(e.target.value);
                      setInviteError(null);
                    }}
                    disabled={inviting}
                    className="pl-9"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  disabled={inviting || !inviteEmail.trim()}
                  className="bg-teal-500 text-white hover:bg-teal-400"
                >
                  {inviting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  Invite
                </Button>
              </form>
              {inviteError && (
                <p className="mt-2 text-xs text-destructive">{inviteError}</p>
              )}
            </div>
          )}

          {/* People with access */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                People with access
              </span>
              {!loading && data && (
                <span className="text-xs text-muted-foreground">{totalCount} total</span>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ScrollArea className="max-h-64">
                <div className="flex flex-col gap-2">
                  {/* Owner row */}
                  {data && (
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                      <PersonAvatar {...data.owner} />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          {data.owner.displayName && (
                            <span className="truncate text-sm font-medium text-foreground">
                              {data.owner.displayName}
                            </span>
                          )}
                          <RoleBadge role="OWNER" />
                        </div>
                        <span className="truncate text-xs text-muted-foreground">
                          {data.owner.email}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Collaborator rows */}
                  {data?.collaborators.map((collab) => (
                    <div
                      key={collab.email}
                      className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3"
                    >
                      <PersonAvatar {...collab} />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-foreground">
                            {collab.displayName ?? collab.email}
                          </span>
                          <RoleBadge role="COLLABORATOR" />
                        </div>
                        <span className="truncate text-xs text-muted-foreground">
                          {collab.email}
                        </span>
                      </div>
                      {isOwner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                          onClick={() => handleRemove(collab.email)}
                          disabled={removing.has(collab.email)}
                          aria-label={`Remove ${collab.displayName ?? collab.email}`}
                        >
                          {removing.has(collab.email) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  ))}

                  {data?.collaborators.length === 0 && !loading && (
                    <p className="py-2 text-center text-xs text-muted-foreground">
                      No collaborators yet
                    </p>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
