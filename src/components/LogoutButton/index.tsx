'use client'

import React from 'react'
import { logoutAction } from '@/lib/actions'
import { Button } from '@/components/ui/button'

const LogoutButton = (): JSX.Element => (
  <Button
    onClick={() => {
      logoutAction()
    }}
    size="sm"
  >
    Logout
  </Button>
)

export default LogoutButton
