import React, { useCallback, useEffect, useRef } from 'react'

import MuiInput, { InputProps } from '@mui/material/Input'
import { useField } from '@unform/core'

import { ErrorMessage } from './styles'

interface Props extends InputProps {
  label?: string
  number?: boolean
}

export const Input: React.FC<Props> = ({ name, type = 'text', id, label, number, onChange, placeholder, multiline }) => {
  const ref = useRef<HTMLInputElement>(null)
  const { defaultValue, fieldName, registerField, error } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'value',
      clearValue() {
        ref.current.value = ''
      }
    })
  }, [registerField, fieldName])

  const handleChange = useCallback(
    e => {
      let value: string = e.target.value
      if (number) {
        if (value.includes('.')) {
          // Only lets value have 1 dot
          value = `${value.split('.')[0]}.${value.split('.')[1].replace(/\./, '')}`
        }
        ref.current.value = value.replace(/[^0-9.]/g, '')
      }
      if (onChange) onChange(e)
    },
    [number, onChange]
  )

  return (
    <div style={{ padding: 4 }}>
      {label ? <label htmlFor={id}>{label}</label> : null}
      <MuiInput
        fullWidth
        type={type}
        inputProps={{ id }}
        name={name}
        onChange={handleChange}
        defaultValue={defaultValue}
        inputRef={ref}
        multiline={multiline}
        placeholder={placeholder}
      />
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </div>
  )
}
