import { useEffect, useRef, useState } from 'react'

import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import MuiSwitch, { SwitchProps } from '@mui/material/Switch'
import { useField } from '@unform/core'

interface Props extends SwitchProps {
  name: string
  label?: string
}

export const Switch: React.FC<Props> = ({ name, label = '', onChange, ...props }) => {
  const ref = useRef(null)
  const { defaultValue, fieldName, registerField } = useField(name)
  const [checked, setChecked] = useState(!!defaultValue)
  const [started, setStarted] = useState(false)
  const id = `id-${name}`

  const handleSelection: any = (event: any, check?: boolean) => {
    setChecked(!!check)
    if (onChange) onChange(event, check)
  }

  useEffect(() => {
    if (ref.current) {
      registerField({
        name: fieldName,
        ref: ref.current,
        path: 'checked',
        setValue: (r, value: boolean) => {
          setChecked(value)
          if (r.current) r.checked = value
        },
        clearValue() {
          setChecked(false)
        }
      })
    }
  }, [fieldName, registerField, checked])

  useEffect(() => {
    if (!started && typeof defaultValue !== 'undefined') {
      setChecked(!!defaultValue)
      setStarted(true)
    }
  }, [started, defaultValue])

  return (
    <FormGroup>
      <FormControlLabel
        control={<MuiSwitch {...props} id={id} inputRef={ref} checked={!!checked} defaultChecked={defaultValue} onChange={handleSelection} />}
        htmlFor={id}
        label={label}
      />
    </FormGroup>
  )
}
