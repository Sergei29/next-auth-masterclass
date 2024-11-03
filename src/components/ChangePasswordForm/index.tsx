'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { formSchema } from '@/lib/validation/changePassword'
import { usePasswordField, useToast } from '@/lib/hooks'
import { changePasswordAction } from '@/lib/actions'

const ChangePasswordForm = (): JSX.Element => {
  const { toast } = useToast()
  const [fieldType, toggleType] = usePasswordField()
  const [newFieldType, toggleNewType] = usePasswordField()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      passwordConfirm: '',
    },
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await changePasswordAction(data)

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

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
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
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
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
                          type={newFieldType}
                          autoComplete="new-password"
                        />
                        <TogglePassword
                          isVisible={newFieldType === 'text'}
                          onClick={toggleNewType}
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
                          type={newFieldType}
                          autoComplete="new-password"
                        />
                        <TogglePassword
                          isVisible={newFieldType === 'text'}
                          onClick={toggleNewType}
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
              <Button type="submit">Change password</Button>
              <ResetButton onClick={() => form.reset()} />
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordForm
