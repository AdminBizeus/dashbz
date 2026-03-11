import styled from 'styled-components'

export const FixedStatic = styled.main`
  background-attachment: fixed;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  &:before {
    content: '';
    display: block;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -10;
  }
`

export const FixedRelative = styled.main`
  position: relative;
  width: 100%;
  height: 100%;
`
