import { FixedStatic, FixedRelative } from './styles'

export const Fixed = ({ children }) => {
  return (
    <FixedStatic>
      <FixedRelative>{children}</FixedRelative>
    </FixedStatic>
  )
}
