'use client'

import React, { type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

type Props = Pick<ComponentPropsWithoutRef<'button'>, 'className' | 'onClick'>

const ResetButton = ({ className, onClick }: Props): JSX.Element => {
  return (
    <button
      type="button"
      className={cn(
        'text-xs underline ml-auto mr-1 hover:font-semibold active:opacity-80',
        className,
      )}
      onClick={onClick}
    >
      reset
    </button>
  )
}

export default ResetButton
