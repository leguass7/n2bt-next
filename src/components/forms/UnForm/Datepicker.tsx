import { useCallback, useEffect, useRef, useState } from 'react'

import DatePicker, { type DatePickerProps } from '@mui/lab/DatePicker'
import TextField from '@mui/material/TextField'
import { useField } from '@unform/core'

import { ErrorMessage } from './styles'

interface Props extends Partial<DatePickerProps<any>> {
  name: string
}

export const Datepicker: React.FC<Props> = ({ name, onChange, label = 'Data de entrega', ...props }) => {
  const ref = useRef(null)
  const { fieldName, defaultValue = null, registerField, error } = useField(name)
  const [value, setValue] = useState<string | Date>(defaultValue)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      getValue() {
        return value
      },
      clearValue(clearRef: HTMLInputElement) {
        setValue(null)
        if (clearRef) clearRef.value = ''
      },
      setValue(setRef: HTMLInputElement, date: string | Date = null) {
        setValue(date)
      }
    })
  }, [registerField, fieldName, value])

  const handleChange = useCallback(
    (date: string | Date = null, keyboardInputValue?: string) => {
      setValue(date)
      if (onChange) onChange(date, keyboardInputValue)
    },
    [onChange]
  )

  return (
    <div style={{ padding: 4 }}>
      <DatePicker
        {...props}
        inputRef={ref}
        label={label}
        value={value}
        onChange={handleChange}
        renderInput={params => <TextField fullWidth {...params} />}
      />
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </div>
  )
}
