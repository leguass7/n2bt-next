import { ChangeEventHandler, useCallback, useEffect, useRef, useState } from 'react'

import { FormControl, InputLabel } from '@mui/material'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import MuiSelect, { SelectProps } from '@mui/material/Select'
import { useField } from '@unform/core'

import { ErrorMessage } from './styles'

export type SelectItem = MenuItemProps<'li', { label: string; value: string | number }>

interface Props extends SelectProps {
  items: SelectItem[]
  label: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

const Select: React.FC<Props> = ({ name, items, label, inputProps, onChange, ...props }) => {
  const inputRef = useRef(null)
  const [selected, setSelected] = useState('')
  const { fieldName, defaultValue, registerField, error } = useField(name)

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputRef,
      getValue() {
        return selected
      },
      setValue(ref, newValue = '') {
        setSelected(newValue)
      }
    })
  }, [registerField, fieldName, selected])

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      setSelected(e.target?.value ?? '')
      if (onChange) onChange(e)
    },
    [onChange]
  )

  return (
    <div style={{ padding: 4 }}>
      <FormControl fullWidth>
        <InputLabel id={label}>{label}</InputLabel>
        <MuiSelect
          labelId={label}
          name={name}
          value={selected}
          onChange={handleChange}
          defaultValue={defaultValue}
          inputRef={inputRef}
          label={label}
          {...props}
          inputProps={inputProps}
        >
          {items?.map(item => {
            return (
              <MenuItem key={`item-${item?.label}-${item?.value}`} {...item}>
                {item.label || null}
              </MenuItem>
            )
          })}
        </MuiSelect>
      </FormControl>
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </div>
  )
}

export default Select
