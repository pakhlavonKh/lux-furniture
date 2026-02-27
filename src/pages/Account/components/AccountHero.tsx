// src/pages/Account/components/AccountHero.tsx

interface User {
  name: string;
  email: string;
}

interface Props {
  user?: User;
  isLoading?: boolean;
}

export default function AccountHero({ user, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="border border-border p-10 bg-card animate-pulse">
        <div className="h-8 w-40 bg-muted mb-4 rounded" />
        <div className="h-4 w-64 bg-muted rounded" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="border border-border p-10 bg-card">
      <h1 className="text-3xl font-serif tracking-wide mb-2">
        My Account
      </h1>

      <p className="text-muted-foreground">
        Welcome back,{" "}
        <span className="text-foreground font-semibold">
          {user.name}
        </span>
      </p>

      <p className="text-sm text-muted-foreground mt-2">
        {user.email}
      </p>
    </div>
  );
}