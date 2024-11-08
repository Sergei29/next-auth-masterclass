'use client'

import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

import { Button } from '@/components/ui/button'
import {
  generate2FSecretAction,
  activate2FAction,
  deactivate2FAction,
} from '@/lib/actions'
import { useToast } from '@/lib/hooks'
import OTPForm from '@/components/OTPForm'

interface Props {
  isTwoFactorActivated: boolean
}

const TwoFactorAuthForm = ({ isTwoFactorActivated }: Props): JSX.Element => {
  const [isActivated, setIsActivated] = useState(() => isTwoFactorActivated)
  const [step, setStep] = useState(1)
  const [code, setCode] = useState<string | null>(null)
  const { toast } = useToast()

  const handleEnable2FA = async () => {
    const response = await generate2FSecretAction()

    if (response.error) {
      toast({
        title: response.message,
        variant: 'destructive',
      })
      return
    }

    setStep(2)
    setCode(response.twoFactorSecret ?? null)
  }

  const handleDisable2FA = async () => {
    const response = await deactivate2FAction()
    if (response?.error) {
      toast({
        title: response.message,
        variant: 'destructive',
      })
      return
    }

    toast({
      className: 'bg-green-500 text-white',
      title: 'Two-Factor Authentication has been disabled',
    })
    setIsActivated(false)
    setStep(1)
  }

  const onOTPSubmit = async (otp: string) => {
    const response = await activate2FAction(otp)

    if (response?.error) {
      toast({
        title: response.message,
        variant: 'destructive',
      })
      return
    }

    toast({
      className: 'bg-green-500 text-white',
      title: 'Two-Factor Authentication has been enabled',
    })

    setIsActivated(true)
  }

  return (
    <div>
      {isActivated && (
        <Button variant="destructive" onClick={handleDisable2FA}>
          Disable Two-Factor Authentication
        </Button>
      )}
      {!isActivated && (
        <div>
          {step === 1 && (
            <Button onClick={handleEnable2FA}>
              Enable Two-Factor Authentication
            </Button>
          )}
          {step === 2 && code && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground my-2">
                Scan the QR code below in your authenticator app to activate
                Two-Factor authentication
              </p>
              <QRCodeSVG value={code} />
              <Button
                className="w-full mt-4"
                onClick={() => {
                  setStep(3)
                }}
              >
                I have scanned the QR code
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStep(1)
                }}
              >
                Cancel
              </Button>
            </div>
          )}
          {step === 3 && (
            <OTPForm
              onSubmit={onOTPSubmit}
              onCancel={() => {
                setStep(2)
              }}
            >
              <p className="text-xs text-muted-foreground">
                Please enter the one-time passcode from the Google Authenticator
                app
              </p>
            </OTPForm>
          )}
        </div>
      )}
    </div>
  )
}

export default TwoFactorAuthForm
