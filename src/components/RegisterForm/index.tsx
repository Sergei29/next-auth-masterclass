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
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
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
import { Input } from '@/components/ui/input'
import { formSchema } from '@/lib/validation/register'
import { usePasswordField } from '@/lib/hooks'
import { registerAction } from '@/lib/actions'

const RegisterForm = (): JSX.Element => {
  const [fieldType, toggleType] = usePasswordField()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await registerAction(data)

    if (response?.error) {
      form.setError('email', { message: response.message })
    }
  }

  if (form.formState.isSubmitSuccessful) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Your account has been created!</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/login">Login to your account</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Register for a new account.</CardDescription>
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
                      <Input {...field} />
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
                          autoComplete="new-password"
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

              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password confirm</FormLabel>
                    <FormControl>
                      <span className="relative">
                        <Input
                          {...field}
                          type={fieldType}
                          autoComplete="new-password"
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

              <Button type="submit">Register</Button>
              <ResetButton onClick={() => form.reset()} />
            </fieldset>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-muted-foreground text-xs">
        <div className="flex gap-1 justify-center">
          <p>Already have an account?</p>
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

export default RegisterForm
