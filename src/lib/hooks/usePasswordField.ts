import { useState, useCallback } from 'react'

export const usePasswordField = (): ['text' | 'password', () => void] => {
  const [inputType, setInputType] = useState<'text' | 'password'>('password')

  const toggleType = useCallback(
    () =>
      setInputType((current) => (current === 'password' ? 'text' : 'password')),
    [],
  )

  return [inputType, toggleType]
}
