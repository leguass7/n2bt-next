import { useCallback, useEffect, useRef, useState } from 'react'

import TextField from '@mui/material/TextField'
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker'
import { useField } from '@unform/core'
import { parseISO } from 'date-fns'

import { ErrorMessage } from './styles'

interface Props extends Partial<TimePickerProps<any, any>> {
  name: string
}

export const Timepicker: React.FC<Props> = ({ name, onChange, label = 'Data de entrega', ...props }) => {
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
        if (typeof date === 'string') setValue(parseISO(date))
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
      <TimePicker {...props} inputRef={ref} label={label} value={value} onChange={handleChange} renderInput={params => <TextField {...params} />} />
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </div>
  )
}
