'use client'

import React, { type ReactNode, useState } from 'react'
import { REGEXP_ONLY_DIGITS } from 'input-otp'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'

interface Props {
  onSubmit: (otp: string) => Promise<void>
  onCancel?: () => void
  children?: ReactNode
  labelSubmit?: string
}

const OTPForm = ({
  onSubmit,
  onCancel,
  children,
  labelSubmit,
}: Props): JSX.Element => {
  const [otp, setOtp] = useState('')

  const handleOTPSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (otp.length !== 6) return
    await onSubmit(otp)
    setOtp('')
  }

  const handleCancel = () => {
    setOtp('')
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <form onSubmit={handleOTPSubmit} className="flex flex-col gap-2">
      {children}
      <InputOTP
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        value={otp}
        onChange={setOtp}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Button type="submit" disabled={otp.length !== 6}>
        {labelSubmit ?? 'Submit and activate'}
      </Button>
      {onCancel && (
        <Button onClick={handleCancel} type="button" variant="outline">
          Cancel
        </Button>
      )}
    </form>
  )
}

export default OTPForm
