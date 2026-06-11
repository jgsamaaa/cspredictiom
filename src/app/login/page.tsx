import { LoginForm } from "@/app/login/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 data-grid">
      <div className="w-full max-w-5xl">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
            Private CS2 model room
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
            Prediction research, journal, and live context in one locked workspace.
          </h2>
        </div>
        <LoginForm nextPath={next ?? "/dashboard"} />
      </div>
    </main>
  );
}
