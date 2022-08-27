import React, { useCallback, useEffect, useRef, useState } from 'react'

import { MobileDatePicker } from '@mui/x-date-pickers'
import { useField } from '@unform/core'
import { parseISO, parse, isValid } from 'date-fns'

import { VariantColorsTypes } from '~/components/AppThemeProvider/types'
import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'

import { Container, Input, Label } from '../InputText/styles'

function convertDefaultValue(d: Date | string) {
  const date = d instanceof Date ? d : parse(d, 'yyyy-MM-dd', new Date())
  return isValid(date) ? date : null
}

type Props = {
  name: string
  label: string
  clearable?: boolean
  fullWidth?: boolean
  themeColor?: VariantColorsTypes
  disabled?: boolean
  maxDate?: Date
  minDate?: Date
}
export const InputDate: React.FC<Props> = ({ name, label, themeColor = 'primary', disabled, maxDate, minDate }) => {
  const [actived, setActived] = useState(false)
  const { theme } = useAppTheme()
  const inputRef = useRef<HTMLInputElement>(null)
  const { fieldName, defaultValue, registerField } = useField(name)

  const [dates, setDates] = useState<Date>(defaultValue ? convertDefaultValue(defaultValue) || null : null)

  const id = `input-text-${fieldName}`

  const handleOpen = () => setActived(true)
  const handleClose = () => setActived(false)

  const handleChange = useCallback((d: any) => {
    if (d instanceof Date) {
      setDates(d)
    } else {
      setDates(parseISO(d))
    }
  }, [])

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: () => {
        return dates || null
      }
    })
  }, [fieldName, registerField, dates])

  return (
    <MobileDatePicker
      inputRef={inputRef}
      renderInput={({ inputRef, inputProps }) => (
        <Container labelColor={theme.colors[themeColor]} disabled={disabled}>
          <Input id={id} ref={inputRef} {...inputProps} className={'calendar'} />
          {label ? (
            <Label htmlFor={id} actived={actived}>
              {label}
            </Label>
          ) : null}
        </Container>
      )}
      toolbarTitle={label}
      value={dates || null}
      onChange={handleChange}
      onAccept={handleChange}
      maxDate={maxDate}
      minDate={minDate}
      onOpen={handleOpen}
      onClose={handleClose}
      // DialogProps={{
      //   PaperProps: {
      //     sx: { backgroundColor: '#f1f1f1' }
      //   }
      // }}
    />
  )
}
