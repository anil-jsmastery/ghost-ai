import { SignUp } from "@clerk/nextjs";
import { FileText, Network, Share2 } from "lucide-react";

export default function SignUpPage() {
  return (
    <main className="flex h-screen">
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-card border-r border-border px-16 py-12">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary-foreground">G</span>
          </div>
          <span className="text-sm font-medium text-foreground">Ghost AI</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-foreground leading-tight mb-4">
            Design systems at the<br />speed of thought.
          </h1>

          <p className="text-sm text-muted-foreground mb-12 leading-relaxed">
            Describe your architecture in plain English. Ghost AI maps it to a shared canvas your whole team can refine in real time.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Network className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">AI Architecture Generation</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Describe your system, AI maps it to nodes and edges on a live canvas.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Share2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Real-time Collaboration</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Live cursors, presence indicators, and shared node editing across your team.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Instant Spec Generation</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Export a complete Markdown technical spec directly from the canvas graph.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">© 2026 Ghost AI. All rights reserved.</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background">
        <SignUp />
      </div>
    </main>
  );
}
