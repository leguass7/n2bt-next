import React, { useEffect, useCallback, useRef, useState } from 'react'

import TextField from '@mui/material/TextField'
import { MobileDatePicker } from '@mui/x-date-pickers'
import { useField } from '@unform/core'
import { parseISO, isValid, parseJSON } from 'date-fns'

import { VariantColorsTypes } from '~/components/AppThemeProvider/types'

function convertDefaultValue(d: Date | string) {
  const date = d instanceof Date ? d : parseJSON(d)
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
export const MuiInputDate: React.FC<Props> = ({ name, label, disabled, maxDate, minDate }) => {
  const [, setActived] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { fieldName, defaultValue, registerField } = useField(name)

  const [dates, setDates] = useState<Date>(defaultValue ? convertDefaultValue(defaultValue) || null : null)

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
    registerField<Date>({
      name: fieldName,
      ref: inputRef,
      getValue: () => {
        return dates || null
      }
      // setValue: (ref: React.MutableRefObject<HTMLInputElement>, value) => {
      //   setDates(convertDefaultValue(value))
      // },
      // clearValue: () => {
      //   setDates(null)
      // }
    })
  }, [fieldName, registerField, dates])

  return (
    <MobileDatePicker
      key={`aff-${defaultValue}`}
      inputRef={inputRef}
      label={label}
      renderInput={params => <TextField {...params} variant="standard" helperText={null} />}
      toolbarTitle={label}
      value={dates || null}
      onChange={handleChange}
      onAccept={handleChange}
      maxDate={maxDate}
      minDate={minDate}
      onOpen={handleOpen}
      onClose={handleClose}
      disabled={!!disabled}
    />
  )
}
