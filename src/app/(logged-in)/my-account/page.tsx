import { eq } from 'drizzle-orm'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TwoFactorAuthForm from '@/components/TwoFactorAuthForm'
import { Label } from '@/components/ui/label'
import { users } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { auth } from '@/auth'

const AccountPage = async () => {
  const session = await auth()
  const [user] = await db
    .select({
      twoFactorActivated: users.twoFactorActivated,
    })
    .from(users)
    .where(eq(users.id, parseInt(session?.user?.id as string, 10)))

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>My Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Email address</Label>
        <div className="text-muted-foreground">{session?.user?.email}</div>
        <TwoFactorAuthForm isTwoFactorActivated={!!user?.twoFactorActivated} />
      </CardContent>
    </Card>
  )
}

export default AccountPage
