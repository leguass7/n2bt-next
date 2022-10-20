import React from 'react'

import { Search } from '@mui/icons-material'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

import { debounceEvent } from '~/helpers/debounce'

interface InputSearchProps {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>
  value?: string | number
  label?: string
  name?: string
  className?: string
  style?: React.CSSProperties
  debounce?: number
}

const InputSearch: React.FC<InputSearchProps> = props => {
  const { name, label, value, className, onChange, onKeyUp, style = {}, debounce = 300 } = props

  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      autoComplete="off"
      size="small"
      onChange={debounceEvent(onChange, debounce)}
      className={className}
      style={{ padding: 0, ...style }}
      InputProps={{
        style: { padding: 0, paddingLeft: 6 },
        startAdornment: (
          <InputAdornment position="start">
            <Search color="primary" />
          </InputAdornment>
        )
      }}
      onKeyUp={onKeyUp}
    />
  )
}

export default InputSearch
