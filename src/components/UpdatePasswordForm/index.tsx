'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { passwordMatchSchema as formSchema } from '@/lib/validation/register'
import { passwordUpdateAction } from '@/lib/actions'
import { usePasswordField, useToast } from '@/lib/hooks'
import Link from 'next/link'

export const PageNotValidMessage = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>The page is not valid</CardTitle>
        <CardDescription>
          Your password link is not valid or has expired.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link
            href={{
              pathname: '/password-reset',
            }}
            className="text-xs"
          >
            Request another password reset link
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

interface Props {
  token: string
}

const UpdatePasswordForm = ({ token }: Props): JSX.Element => {
  const { toast } = useToast()
  const [fieldType, toggleType] = usePasswordField()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await passwordUpdateAction(token, data)
    if (response?.error) {
      form.setError('root', { message: response.message })
    } else {
      toast({
        title: 'Password changed.',
        description: 'Your password has been updated',
        className: 'bg-green-500 text-white',
      })
      form.reset()
    }
  }

  if (form.formState.isSubmitSuccessful) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Password changed</CardTitle>
          <CardDescription>Please login with your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/login">Login yo your account</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Update password</CardTitle>
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
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
                    <FormLabel>Confirm new password</FormLabel>
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

              {form.formState.errors.root?.message && (
                <FormMessage>{form.formState.errors.root.message}</FormMessage>
              )}
              <Button type="submit">Update password</Button>
              <ResetButton onClick={() => form.reset()} />
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default UpdatePasswordForm
