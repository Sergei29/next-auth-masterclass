'use client'

import React, { type ComponentPropsWithoutRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'

interface Props extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  isVisible: boolean
}

const TogglePassword = ({
  isVisible,
  className,
  ...restButtonProps
}: Props): JSX.Element => {
  return (
    <button
      className={cn(className, 'rounded-full')}
      type="button"
      {...restButtonProps}
    >
      {isVisible ? <Eye /> : <EyeOff />}
    </button>
  )
}

export default TogglePassword
