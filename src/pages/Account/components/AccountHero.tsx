interface User {
  name: string
  email: string
}

interface Props {
  user: User
}

export default function AccountHero({ user }: Props) {
  return (
    <div className="bg-muted/40 py-24 text-center">
      <h1 className="heading-display mb-6">
        Account
      </h1>

      <p className="text-lg text-muted-foreground">
        {user.name}
      </p>

      <p className="text-sm text-muted-foreground mt-2">
        {user.email}
      </p>
    </div>
  )
}