export interface PageProps<
  P = Record<string, string>,
  Q = Record<string, string>,
> {
  params: Promise<P>
  searchParams: Promise<Q>
}

export interface PasswordResetToken {
  id: number
  userId: number
  token: string
  tokenExpiry: Date
}
