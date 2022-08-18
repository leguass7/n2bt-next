import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import styled from 'styled-components'
import { v4 as uuidV4 } from 'uuid'

import { ISliderDimensions, usePassRoll, usePassRollRegister } from './PassRollProvider'
import { filterChildrenElements } from './reactUtils'
import { SliderList, SliderItem } from './SliderList'
import { WrapperItem } from './WrapperItem'

const MainContainer = styled.div<{ showingInactive?: boolean }>`
  width: 100%;
  max-width: 100%;
  height: 100%;
  min-height: 100%;
  border: 0;
  display: block;
  overflow-x: ${({ showingInactive }) => (showingInactive ? 'visible' : 'hidden')};
`

const WrapperContainer = styled.div<{ mainWidth?: number; mainHeight?: number }>`
  width: ${({ mainWidth = 0 }) => mainWidth}px;
  max-width: ${({ mainWidth = 0 }) => mainWidth}px;
  border: 0;
  display: block;
  height: ${({ mainHeight }) => (mainHeight ? `${mainHeight}px` : `100%`)};
`

type MainProps = {
  children?: React.ReactNode
  name: string
  /** @deprecated Não implementado */
  vertical?: boolean
  timing?: number
  mainHeight?: number
  showingInactive?: boolean
  unMount?: boolean
  onSliderChange?: (index: number) => void
  onSliderChangeComplete?: (index: number) => void
  onLayout?: (dimensions?: ISliderDimensions, ref?: HTMLDivElement) => void
}

export const Main: React.FC<MainProps> = ({
  children,
  name,
  vertical,
  timing = 500,
  showingInactive,
  unMount,
  onSliderChangeComplete,
  onSliderChange,
  onLayout,
  mainHeight
}) => {
  const { ref, width, height } = useResizeDetector<HTMLDivElement>({ refreshMode: 'debounce', refreshRate: 100 })
  const [indexMounted, setIndexMounted] = useState<number>(0)
  const refReg = useRef(false)
  const [registerSlider, unregisterSlider] = usePassRollRegister()
  const { slider } = usePassRoll(name)

  const childrenElements = useMemo(() => {
    return filterChildrenElements(children, [SliderItem]).map((child, i) => ({ child, key: uuidV4(), index: i + 1 }))
  }, [children])

  const sliderIndexSelected = useMemo(() => {
    return slider?.indexSelected || 1
  }, [slider])

  const handleSlideChange = useCallback(
    (index: number) => {
      if (onSliderChange) onSliderChange(index)
      let a: any = null
      a = setTimeout(() => {
        clearTimeout(a)
        if (onSliderChangeComplete) onSliderChangeComplete(index)
        setIndexMounted(index)
      }, timing)
    },
    [onSliderChange, onSliderChangeComplete, timing]
  )

  const handleLayout = useCallback(
    (dimensions: ISliderDimensions, ref: HTMLDivElement) => {
      if (onLayout && typeof onLayout === 'function') onLayout(dimensions, ref)
    },
    [onLayout]
  )

  useEffect(() => {
    if (!refReg.current && ref.current && (width || height)) {
      refReg.current = true
      registerSlider({
        ref: ref.current,
        name,
        vertical: !!vertical,
        dimensions: { width, height },
        onChange: handleSlideChange
      })
      handleLayout({ width, height }, ref.current)
    }
  }, [ref, name, registerSlider, width, height, vertical, handleSlideChange, handleLayout])

  useEffect(() => {
    const unReg = () => {
      if (refReg.current) {
        refReg.current = false
        unregisterSlider(name)
      }
    }
    return () => {
      unReg()
    }
  }, [unregisterSlider, name])

  return (
    <MainContainer ref={ref} showingInactive={!!showingInactive}>
      <WrapperContainer mainWidth={width} mainHeight={mainHeight}>
        <SliderList count={childrenElements.length || 1} mainWidth={width} indexSelected={sliderIndexSelected} timing={timing}>
          {childrenElements.map(({ child, key, index }) => {
            const actived = sliderIndexSelected === index
            const mounted = (unMount && indexMounted) || 0
            return (
              <WrapperItem key={key} width={width} height={height} index={index} actived={actived} mounted={mounted}>
                {child}
              </WrapperItem>
            )
          })}
        </SliderList>
      </WrapperContainer>
    </MainContainer>
  )
}
