import styled, { css } from 'styled-components'

import type { FlexProps, TextProps } from '~/styles/types'

export const Span = styled.span<TextProps & { verticalPad?: number; horizontalPad?: number }>`
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  font-size: ${({ textSize = 14 }) => textSize}px;
  color: ${({ textColor = 'inherit' }) => textColor};
  text-align: ${({ align = 'inherit' }) => align};
  text-transform: ${({ transform = 'none' }) => transform};
  font-style: ${({ textStyle = 'normal' }) => textStyle};
  padding: ${({ horizontalPad = 0, verticalPad = 0 }) => `${verticalPad}px ${horizontalPad}px`};
  text-shadow: 0px 0px 1px rgba(0, 0, 0, 0.3);
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  max-width: 100%;
`

export const FlexBox = styled.div<FlexProps & { textColor?: string; gap?: number }>`
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  display: flex;
  justify-content: ${({ justify = 'space-between' }) => justify};
  align-items: center;
  align-content: center;
  width: ${({ width = '100%' }) => width};
  max-width: 100%;
  padding: ${({ horizontalPad = 0, verticalPad = 0 }) => `${verticalPad}px ${horizontalPad}px`};
  color: ${({ textColor = 'inherit' }) => textColor};
  flex-wrap: ${({ wrap = 'wrap' }) => wrap};
  flex-direction: ${({ direction = 'row' }) => direction};
  gap: ${({ gap = 0 }) => gap}px;
  ${({ grow }) =>
    grow
      ? css`
          flex: ${grow};
        `
      : css``}
`
