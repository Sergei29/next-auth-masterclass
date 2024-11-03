export interface PageProps<
  P = Record<string, string>,
  Q = Record<string, string>,
> {
  params: P
  searchParams: Q
}

export interface PasswordResetToken {
  id: number
  userId: number
  token: string
  tokenExpiry: Date
}
