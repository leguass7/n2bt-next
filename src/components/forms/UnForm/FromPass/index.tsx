import React, { useCallback, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { Form } from '@unform/web'
import { object, string } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { H4, Text } from '~/components/styled'
import { validateFormData } from '~/helpers/validation'
import { type Authorization, sendRecover } from '~/services/api/user/recover'

import { Input } from '../Input'

type FormData = { password: string }

const schema = object().shape({
  password: string().required('Não authorizado')
})

export type FromPassProps = {
  onSuccess?: () => void
  onFailed?: (message: string) => void
  onInvalid?: (data: Record<keyof FormData, string>) => void
  onCancel?: () => void
  authorization: Omit<Authorization, 'password'>
}
export const FromPass: React.FC<FromPassProps> = ({ onInvalid, onSuccess, onFailed, onCancel, authorization }) => {
  const [loading, setLoading] = useState(false)
  const formRef = useRef()

  const handleSubmit = useCallback(
    async (data: FormData) => {
      const invalid = await validateFormData(schema, data, formRef.current)
      if (invalid) {
        if (onInvalid) onInvalid(invalid)
        return null
      }
      setLoading(true)
      const response = await sendRecover({ ...data, ...authorization })
      setLoading(false)
      if (response?.success) {
        if (onSuccess) onSuccess()
      } else {
        toast.error(response?.message || 'Erro ao enviar código')
        if (onFailed) onFailed(`${response?.message}`)
      }
    },
    [onInvalid, onSuccess, onFailed, authorization]
  )

  return (
    <>
      <H4 align="center" transform="uppercase">
        {'Definição de nova senha'}
      </H4>
      <p style={{ maxWidth: 320, paddingTop: 5, paddingBottom: 20 }}>
        <Text textSize={14}>Informe sua nova senha.</Text>
      </p>

      <Form ref={formRef} onSubmit={handleSubmit} role="form">
        <Input type="password" name="password" label="senha" />
        <Input type="password" name="confirmPassword" label="Confirmar senha" />

        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          {onCancel ? (
            <Button color="primary" variant="outlined" type="button" onClick={onCancel}>
              {'Voltar'}
            </Button>
          ) : null}
          <Button color="primary" variant="contained" type="submit" disabled={!!loading}>
            {'Enviar'}
          </Button>
        </Stack>
      </Form>
      {loading ? <CircleLoading /> : null}
    </>
  )
}
