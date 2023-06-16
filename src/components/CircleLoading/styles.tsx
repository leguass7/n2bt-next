import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
`

export const LoadContainer = styled.div<{
  bgColor: string
  stroke: number
  bColor: string
  speed: number
  size: number
  relative?: boolean
  minheight?: number
}>`
  position: ${({ relative }) => (relative ? 'relative' : 'absolute')};
  margin: 0 auto;
  top: 0;
  left: 0;
  background-color: ${({ bgColor }) => bgColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 100%;
  height: 100%;
  min-height: ${({ minheight }) => (minheight ? `${minheight}px` : '100%')};
  p {
    font-size: 12px;
  }
  div.loadContent {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    div {
      display: block;
      border-radius: 50%;
      border: ${({ stroke }) => stroke}px solid #f1f1f1;
      border-top-color: ${({ bColor }) => bColor || '#000'};
      animation: ${rotate} 200ms linear infinite;
      animation-duration: ${({ speed }) => `${speed}ms`};
      width: ${({ size }) => `${size}px`};
      height: ${({ size }) => `${size}px`};
    }
  }
`
