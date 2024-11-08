'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import TogglePassword from '@/components/TogglePassword'
import ResetButton from '@/components/ResetButton'
import { Button } from '@/components/ui/button'
import OTPForm from '@/components/OTPForm'
import { loginWithCredentialsAction, preLoginCheckAction } from '@/lib/actions'
import { formSchema } from '@/lib/validation/login'
import { usePasswordField, useToast } from '@/lib/hooks'

const LoginForm = (): JSX.Element | null => {
  const [step, setStep] = useState(1)
  const [fieldType, toggleType] = usePasswordField()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const preLoginResponse = await preLoginCheckAction(data)
    if (preLoginResponse?.error) {
      form.setError('root', { message: preLoginResponse.message })
      return
    }

    if (preLoginResponse.twoFactorActivated) {
      // submit 2FA OTP instead
      setStep(2)

      return
    }

    const response = await loginWithCredentialsAction(data)

    if (response?.error) {
      form.setError('root', { message: response.message })
    }
  }

  const email = form.getValues('email')
  const password = form.getValues('password')

  const handleSubmitOtp = async (otp: string) => {
    const response = await loginWithCredentialsAction({ email, password }, otp)

    if (response?.error) {
      toast({
        variant: 'destructive',
        title: response.message,
      })
    }
  }
  if (step === 1) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <fieldset
                disabled={form.formState.isSubmitting}
                className="flex flex-col gap-2"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <span className="relative">
                          <Input
                            {...field}
                            type={fieldType}
                            autoComplete="current-password"
                          />
                          <TogglePassword
                            isVisible={fieldType === 'text'}
                            onClick={toggleType}
                            className="absolute top-8 right-2"
                          />
                        </span>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root?.message && (
                  <FormMessage>
                    {form.formState.errors.root.message}
                  </FormMessage>
                )}
                <Button type="submit">Login</Button>
                <ResetButton onClick={() => form.reset()} />
              </fieldset>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-muted-foreground text-xs">
          <div className="flex gap-1 justify-center">
            <p>Don&apos;t have an account?</p>
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
          <div className="flex gap-1 justify-center">
            <p>Forgot password?</p>
            <Link
              href={{
                pathname: '/password-reset',
                query: email ? { email } : null,
              }}
              className="underline"
            >
              Reset my password
            </Link>
          </div>
        </CardFooter>
      </Card>
    )
  }

  if (step === 2) {
    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>One-time passcode</CardTitle>
          <CardDescription>
            Enter the one-time passcode for the &quot;Next Auth
            Masterclass&quot;
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OTPForm onSubmit={handleSubmitOtp} labelSubmit="Verify OTP" />
        </CardContent>
      </Card>
    )
  }

  return null
}

export default LoginForm
