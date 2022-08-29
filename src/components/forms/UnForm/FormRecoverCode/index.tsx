import React, { useCallback, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { Form } from '@unform/web'
import { object, string } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { H4, Text } from '~/components/styled'
import { validateFormData } from '~/helpers/validation'
import { ResponseAuthorization, sendCode } from '~/services/api/user/recover'

import { Input } from '../Input'

type FormData = { userCode: string }

export type FormRecoverCodeProps = {
  onSuccess?: (authorization?: Partial<ResponseAuthorization>) => void
  onFailed?: (message: string) => void
  onInvalid?: (data: Record<keyof FormData, string>) => void
  onCancel?: () => void
  privateCode: string
}

const schema = object().shape({
  userCode: string().min(6).max(6).required('Código inválido')
  // privateCode: string().min(6).max(6).required('Chave privada inválida')
})

export const FormRecoverCode: React.FC<FormRecoverCodeProps> = ({ onInvalid, onSuccess, onFailed, onCancel, privateCode }) => {
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
      const response = await sendCode({ ...data, privateCode })
      setLoading(false)
      if (response?.success) {
        if (onSuccess) onSuccess({ authorization: response?.authorization, userId: response?.userId })
      } else {
        toast.error(response?.message || 'Erro ao enviar código')
        if (onFailed) onFailed(`${response?.message}`)
      }
    },
    [onInvalid, onSuccess, onFailed, privateCode]
  )

  return (
    <>
      <H4 align="center" transform="uppercase">
        {'Código de recuperação'}
      </H4>
      <p style={{ maxWidth: 320, paddingTop: 5, paddingBottom: 20 }}>
        <Text textSize={14}>Informe o código enviado no seu endereço de e-mail.</Text>
      </p>

      <Form ref={formRef} onSubmit={handleSubmit} role="form">
        <Input type="text" name="userCode" label="código" />

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
