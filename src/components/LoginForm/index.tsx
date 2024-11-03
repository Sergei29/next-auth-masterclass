'use client'

import React from 'react'
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
import { loginWithCredentialsAction } from '@/lib/actions'
import { formSchema } from '@/lib/validation/login'
import { usePasswordField } from '@/lib/hooks'

const LoginForm = (): JSX.Element => {
  const [fieldType, toggleType] = usePasswordField()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await loginWithCredentialsAction(data)

    if (response?.error) {
      form.setError('root', { message: response.message })
    }
  }
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
                <FormMessage>{form.formState.errors.root.message}</FormMessage>
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
          <Link href="/password-reset" className="underline">
            Reset my password
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

export default LoginForm
