import React from 'react'
import LogoutButton from '@/components/LogoutButton'
// import { auth } from '@/auth'
import Link from 'next/link'

interface Props {
  children: React.ReactNode
}

const LoggedInLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-200 flex justify-between items-center p-4">
        <ul className="flex gap-4">
          <li>
            <Link href="/my-account">My account</Link>
          </li>
          <li>
            <Link href="/change-password">Change password</Link>
          </li>
        </ul>
        <div>
          <LogoutButton />
        </div>
      </nav>
      <div className="flex-1 flex flex-col justify-center items-center">
        {children}
      </div>
    </div>
  )
}

export default LoggedInLayout
