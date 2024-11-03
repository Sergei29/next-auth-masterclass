import type { PageProps } from '@/types'

import { getValidToken } from '@/lib/getValidToken'
import UpdatePasswordForm, {
  PageNotValidMessage,
} from '@/components/UpdatePasswordForm'

/**
 * @description an update password page which will check a password reset token
 * If it is valid it's going to display to the user a new password input where
 * the user can actually update
 * Note: From next.js v15 need to await for page params
 * https://nextjs.org/docs/messages/sync-dynamic-apis#possible-ways-to-fix-it
 */
const UpdatePasswordPage = async ({
  searchParams,
}: PageProps<unknown, { token?: string }>) => {
  const { token } = await searchParams
  const validToken = await getValidToken(token)

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center">
      {!validToken ? (
        <PageNotValidMessage />
      ) : (
        <UpdatePasswordForm token={validToken.token} />
      )}
    </main>
  )
}

export default UpdatePasswordPage
