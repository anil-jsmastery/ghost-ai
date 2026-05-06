import Link from "next/link";
import { Lock } from "lucide-react";

export function AccessDenied() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <Lock className="h-10 w-10 text-muted-foreground" />
      <h1 className="text-lg font-semibold text-foreground">Access Denied</h1>
      <p className="text-sm text-muted-foreground">
        This project doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Link
        href="/editor"
        className="rounded-md border border-border bg-transparent px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
      >
        Back to Editor
      </Link>
    </div>
  );
}
