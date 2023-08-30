import { useCallback, useEffect, useRef, useState } from 'react'

import TextField from '@mui/material/TextField'
import { type DateTimePickerProps, DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { useField } from '@unform/core'

import { ErrorMessage } from './styles'

interface Props extends Partial<DateTimePickerProps<Date, Date>> {
  name: string
}

export const Datetimepicker: React.FC<Props> = ({ name, onChange, label = 'Data de entrega', ...props }) => {
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
      if (onChange) onChange(date as any, keyboardInputValue)
    },
    [onChange]
  )

  return (
    <div style={{ padding: 4 }}>
      <DateTimePicker
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
