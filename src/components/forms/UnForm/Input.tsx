import React, { InputHTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'

import { InputProps } from '@mui/material/Input'
import TextField from '@mui/material/TextField'
import { useField } from '@unform/core'

import { ErrorMessage } from './styles'

interface Props extends InputProps {
  label?: string
  number?: boolean
}

export const Input: React.FC<Props> = ({ name, type = 'text', id, label, number, onChange, placeholder, multiline, ...rest }) => {
  const { onBlur, onFocus } = rest
  const ref = useRef<InputHTMLAttributes<HTMLInputElement>>(null)
  const { defaultValue, fieldName, registerField, error } = useField(name)

  const [shrink, setShrink] = useState(false)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      // path: 'value',
      clearValue() {
        ref.current.value = ''
      },
      getValue(input) {
        if (number) return Number(`${input.value ?? 0}`)
        return input?.value
      },
      setValue(input, value) {
        setShrink(!!value || value == 0)
        input.value = value || ''
      }
    })
  }, [registerField, fieldName, number])

  const handleChange = useCallback(
    e => {
      let value: string = e.target.value
      if (number) {
        // Only lets value have 1 dot
        if (value.includes('.')) {
          value = `${value.split('.')[0]}.${value.split('.')[1].replace(/\./, '')}`
        }
        value = value.replace(/[^0-9.]/g, '')

        ref.current.value = value
      }
      if (onChange) onChange(e)
    },
    [number, onChange]
  )

  const handleFocus = useCallback(
    e => {
      setShrink(true)
      onFocus?.(e)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    e => {
      setShrink(!!ref.current?.value)
      onBlur?.(e)
    },
    [onBlur]
  )

  return (
    <div style={{ padding: 4 }}>
      {/* {label ? <label htmlFor={id}>{label}</label> : null} */}
      <TextField
        label={label}
        fullWidth
        type={type}
        inputProps={{ id }}
        name={name}
        onChange={handleChange}
        defaultValue={defaultValue}
        inputRef={ref}
        InputLabelProps={{ shrink }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        multiline={multiline}
        placeholder={placeholder}
        variant="standard"
      />
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </div>
  )
}
