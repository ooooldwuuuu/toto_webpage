import { LoginForm } from "./login-form";

export const metadata = { title: "後台登入" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-accent">
          TOTO<span className="text-foreground"> 後台</span>
        </h1>
        <p className="mt-1 text-sm text-muted">請登入以管理商品</p>
        <LoginForm redirectTo={redirect ?? "/admin"} />
      </div>
    </div>
  );
}
