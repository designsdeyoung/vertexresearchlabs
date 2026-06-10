import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subscribeEmail } from "@/lib/resend";

type Status = "idle" | "loading" | "success" | "error";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || status === "loading") return;
    setStatus("loading");
    const { error } = await subscribeEmail(value, {
      sendWelcome: true,
      source: "homepage-newsletter",
    });
    setStatus(error ? "error" : "success");
  };

  return (
    <section aria-label="Newsletter signup" className="bg-background pb-20 pt-4 md:pb-28">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-accent/20 px-6 py-12 md:px-14 md:py-16"
          style={{
            background:
              "radial-gradient(900px 400px at 20% 0%, hsl(217 91% 60% / 0.16), transparent 60%), radial-gradient(700px 350px at 90% 100%, hsl(172 66% 50% / 0.12), transparent 60%), linear-gradient(180deg, hsl(215 30% 9%), hsl(215 33% 6%))",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-molecule opacity-60" aria-hidden />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2">
            <div className="flex items-start gap-5">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/30 bg-accent/15 shadow-lg shadow-accent/20 sm:flex">
                <Mail size={24} className="text-accent" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  Stay Informed. Stay Ahead.
                </h2>
                <p className="mt-2 max-w-[420px] text-sm leading-relaxed text-muted-foreground md:text-base">
                  Get insider updates on new products, restocks, and research
                  resources — straight to your inbox.
                </p>
              </div>
            </div>

            <div>
              {status === "success" ? (
                <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-5 py-4">
                  <CheckCircle2 size={20} className="shrink-0 text-primary" />
                  <p className="text-sm text-foreground">
                    You're on the list — check your inbox for a welcome email.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Email address"
                    className="h-12 flex-1 rounded-lg border border-border bg-background/70 px-4 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none backdrop-blur-sm transition-colors focus:border-accent/60"
                  />
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="h-12 min-w-[130px] bg-accent text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90"
                  >
                    {status === "loading" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </form>
              )}

              {status === "error" && (
                <p className="mt-2 text-xs text-destructive">
                  Something went wrong — please try again.
                </p>
              )}
              {status !== "success" && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 size={12} className="text-primary" />
                  No spam. Unsubscribe anytime.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
