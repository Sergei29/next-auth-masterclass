'use client'

import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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
import { Button } from '@/components/ui/button'
import { formSchema } from '@/lib/validation/resetPassword'
import { passwordResetAction } from '@/lib/actions'

const ResetPasswordForm = (): JSX.Element => {
  const searchParams = useSearchParams()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await passwordResetAction(data)
    if (response?.error) {
      form.setError('root', { message: response.message })
    }
  }

  if (form.formState.isSubmitSuccessful) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle> 📧 Email sent</CardTitle>
          <CardDescription>
            If you have an account with us - you will receive a password reset
            email at{' '}
            <span className="p-0.5 rounded-sm bg-slate-100 text-primary">
              {form.getValues('email')}
            </span>
            .
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>
          Enter your email address to reset your password.
        </CardDescription>
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

              {form.formState.errors.root?.message && (
                <FormMessage>{form.formState.errors.root.message}</FormMessage>
              )}
              <Button type="submit">Reset my password</Button>
            </fieldset>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-muted-foreground text-xs">
        <div className="flex gap-1 justify-center">
          <p>Remember your password?</p>
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
        <div className="flex gap-1 justify-center">
          <p>Don&apos;t have an account?</p>
          <Link href="/register" className="underline">
            Register
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ResetPasswordForm
