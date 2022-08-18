import React, { useCallback, useState } from 'react'

import { createContext, useContextSelector } from 'use-context-selector'

export interface ISliderDimensions {
  width?: number
  height?: number
}

export interface ISliders {
  ref: HTMLDivElement
  name: string
  dimensions: ISliderDimensions
  vertical?: boolean
  indexSelected?: number
  onChange?: (index: number) => void
}

export interface IPassRollContext {
  readonly sliders: ISliders[]
  setSliders: React.Dispatch<React.SetStateAction<ISliders[]>>
  registerSlider: (data: ISliders) => void
  unregisterSlider: (name: string) => void
  setSelected: (name: string, index: number) => void
  customContext: Record<string, any>
  setCustomContext: React.Dispatch<React.SetStateAction<Record<string, any>>>
}

export const PassRollContext = createContext({} as IPassRollContext)

type PassRollProviderProps = {
  children?: React.ReactNode
}
export const PassRollProvider: React.FC<PassRollProviderProps> = ({ children }) => {
  const [sliders, setSliders] = useState<ISliders[]>([])
  const [customContext, setCustomContext] = useState<Record<string, any>>([])

  const updateSlider = useCallback((name: string, data: Partial<ISliders>) => {
    setSliders(old => {
      return old.map(f => (f.name === name ? { ...f, ...data } : f))
    })
  }, [])

  const registerSlider = useCallback((data: ISliders) => {
    setSliders(old => {
      const found = old.find(f => f.name === data.name)
      if (found) {
        // eslint-disable-next-line no-console
        console.error('PassRollProvider: duplicated ', data.name)
        return old.map(f => (f.name === data.name ? { ...f, ...data } : f))
      }
      return [...old, data]
    })
  }, [])

  const unregisterSlider = useCallback((name: string) => {
    setSliders(old => old.filter(f => f.name !== name))
  }, [])

  const emitChange = useCallback(
    (name: string, index: number) => {
      const found = sliders.find(f => f.name === name)
      if (found && found.onChange) found.onChange(index)
    },
    [sliders]
  )

  const setSelected = useCallback(
    (name: string, index: number) => {
      updateSlider(name, { indexSelected: index })
      emitChange(name, index)
    },
    [updateSlider, emitChange]
  )

  return (
    <PassRollContext.Provider value={{ sliders, setSliders, registerSlider, unregisterSlider, setSelected, customContext, setCustomContext }}>
      {children}
    </PassRollContext.Provider>
  )
}

export function usePassRollRegister(): [IPassRollContext['registerSlider'], IPassRollContext['unregisterSlider']] {
  const registerSlider = useContextSelector(PassRollContext, ctx => ctx.registerSlider)
  const unregisterSlider = useContextSelector(PassRollContext, ctx => ctx.unregisterSlider)
  return [registerSlider, unregisterSlider]
}

export function usePassRoll<CustomData = Record<string, any>>(name: string) {
  const slider = useContextSelector(PassRollContext, ctx => {
    return ctx.sliders.find(f => f.name === name)
  })
  const setSelected = useContextSelector(PassRollContext, ctx => ctx.setSelected)
  const setCustomContext = useContextSelector(PassRollContext, ctx => ctx.setCustomContext)
  const customContext = useContextSelector(PassRollContext, ctx => ctx.customContext) as CustomData

  const goTo = useCallback(
    (index: number, customData?: CustomData) => {
      setSelected(name, index)
      if (customData) setCustomContext(customData)
    },
    [setSelected, name, setCustomContext]
  )
  return { slider, goTo, customContext }
}
