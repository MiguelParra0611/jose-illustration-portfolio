import { Logo } from "@/components/Logo";

// Checkpoint 0 placeholder: proves fonts, colours and the logo render.
// The scroll-driven hero replaces this in checkpoint 1.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <Logo className="w-32 text-white" />
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
        Behind the mask
      </h1>
      <p className="font-mono text-xs tracking-[0.2em] text-vermilion">
        {"// SIGNAL INCOMING"}
      </p>
    </main>
  );
}
