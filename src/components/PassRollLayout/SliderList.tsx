import React, { CSSProperties, useEffect, useMemo, useRef } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import styled from 'styled-components'

import { round } from '~/helpers'

import { ISliderDimensions } from './PassRollProvider'

const SliderItemContainer = styled.div`
  display: block;
  height: 100%;
  width: 100%;
`

type SliderItemProps = {
  children?: React.ReactNode
  style?: CSSProperties
  onLayout?: (dimensions?: ISliderDimensions, ref?: HTMLDivElement | null) => void
}
export const SliderItem: React.FC<SliderItemProps> = ({ children, onLayout, style }) => {
  const refReg = useRef(false)
  const { ref, width, height } = useResizeDetector<HTMLDivElement>()

  useEffect(() => {
    if (!refReg.current) {
      if ((ref.current && width) || height) {
        refReg.current = true
        if (onLayout && typeof onLayout === 'function') onLayout({ width, height }, ref?.current)
      }
    }
  }, [ref, width, height, onLayout])

  return (
    <SliderItemContainer ref={ref} style={style}>
      {children}
    </SliderItemContainer>
  )
}

// -----

const Container = styled.div<{ position: number; timing: number }>`
  border: 0 !important;
  height: 100%;
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  transition: all ease-in-out 0.1s;
  transition-duration: ${({ timing }) => timing}ms;
  transform: translateX(${({ position }) => position}px);
`

type Props = {
  children?: React.ReactNode
  count: number
  indexSelected?: number
  mainWidth?: number
  timing: number
}

export const SliderList: React.FC<Props> = ({ children, mainWidth = 0, count, indexSelected = 1, timing }) => {
  const [position, listWith] = useMemo(() => {
    const w = round(count * mainWidth, 0)
    let c = indexSelected - 1
    if (indexSelected <= 0) c = 0
    if (indexSelected >= count) c = count - 1

    return [c * mainWidth * -1, w]
  }, [count, mainWidth, indexSelected])

  if (!mainWidth) return null

  return (
    <Container style={{ width: listWith }} position={position} timing={timing}>
      {children}
    </Container>
  )
}
