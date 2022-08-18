import React, { memo } from 'react'

import styled, { css } from 'styled-components'

const Container = styled.div<{ actived?: boolean }>`
  display: block;
  transition: all linear 0.4s;
  height: 100%;
  border: 0;

  ${({ actived }) => {
    return actived
      ? css``
      : css`
          filter: blur(0.03rem);
          opacity: 0.2;
          overflow: hidden;
        `
  }}
`

type Props = {
  children?: React.ReactNode
  width?: number
  height?: number
  index?: number
  actived?: boolean
  mounted?: number
}
const Wrapper: React.FC<Props> = ({ children, width = 0, actived, mounted, index }) => {
  return (
    <Container actived={actived} style={{ width, minHeight: '100%' }}>
      {mounted && index && mounted !== index ? null : <>{children}</>}
    </Container>
  )
}

export const WrapperItem = memo(Wrapper) as typeof Wrapper
