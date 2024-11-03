import { Suspense } from 'react'
import ResetPasswordForm from '@/components/ResetPasswordForm'

const PasswordResetPage = async () => {
  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </main>
  )
}

export default PasswordResetPage
