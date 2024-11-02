import React from 'react'

interface Props {
  children: React.ReactNode
}

const LoggedOutLayout = ({ children }: Props): JSX.Element => {
  return <div>{children}</div>
}

export default LoggedOutLayout
