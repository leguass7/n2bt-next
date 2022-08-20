import React, { useCallback, useRef, useState } from 'react'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { Form } from '@unform/web'
import { object, string } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { H4, Text } from '~/components/styled'
import { validateFormData } from '~/helpers/validation'
import { sendForgot } from '~/services/api/user'

import { Input } from '../Input'

type FormData = { email: string }

export type FormForgotProps = {
  onSuccess?: (response?: any) => void
  onFailed?: (message: string) => void
  onInvalid?: (data: Record<keyof FormData, string>) => void
  onCancel?: () => void
}

const schema = object().shape({
  email: string().required('e-mail requerido').email('e-mail inválido')
})

export const FormForgot: React.FC<FormForgotProps> = ({ onInvalid, onSuccess, onFailed, onCancel }) => {
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
      const response = await sendForgot(data?.email)
      setLoading(false)
      if (response?.success) {
        if (onSuccess) onSuccess(response)
      } else {
        if (onFailed) onFailed(`${response?.message}`)
      }
    },
    [onInvalid, onSuccess, onFailed]
  )

  return (
    <>
      <H4 align="center" transform="uppercase">
        {'Recuperar senha'}
      </H4>
      <p style={{ maxWidth: 320, paddingTop: 5, paddingBottom: 20 }}>
        <Text textSize={14}>Informe seu endereço de e-mail utilizado no cadastro para receber instruções de recuperação de senha.</Text>
      </p>

      <Form ref={formRef} onSubmit={handleSubmit} role="form">
        <Input placeholder="endereço de e-mail" type="email" name="email" />

        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          {onCancel ? (
            <Button color="primary" variant="outlined" type="button" disabled={!!loading} onClick={onCancel}>
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
