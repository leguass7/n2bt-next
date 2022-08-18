import React, { useCallback, useMemo, useRef } from 'react'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { Form } from '@unform/web'
import { object, string } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { H4 } from '~/components/styled'
import { validateFormData } from '~/helpers/validation'
import { useAppAuth, PayloadSignin, SignInResponse } from '~/hooks/useAppAuth'

import { Input } from '../Input'

type FormData = PayloadSignin & {}

export type FormSigninProps = {
  onSuccess?: (response?: SignInResponse) => void
  onFailed?: (message: string) => void
  onInvalid?: (data: Record<keyof PayloadSignin, string>) => void
  onForgot?: () => void
}

export const FormSignin: React.FC<FormSigninProps> = ({ onInvalid, onSuccess, onFailed, onForgot }) => {
  const formRef = useRef()
  const { authorize, loading } = useAppAuth()

  const schema = useMemo(() => {
    return object().shape({
      email: string().required('e-mail requerido').email('e-mail inválido'),
      password: string().required('informe a senha')
    })
  }, [])

  const handleSubmit = useCallback(
    async (data: FormData) => {
      const invalid = await validateFormData(schema, data, formRef.current)
      if (invalid) {
        if (onInvalid) onInvalid(invalid)
        return null
      }
      const authorized = await authorize(data)
      if (authorized?.ok) {
        if (onSuccess) onSuccess(authorized)
      } else {
        if (onFailed) onFailed(authorized?.error)
      }
    },
    [schema, onInvalid, onSuccess, onFailed, authorize]
  )

  return (
    <>
      <H4 align="center" transform="uppercase">
        {'Faça login'}
      </H4>

      <Form ref={formRef} onSubmit={handleSubmit} role="form">
        <Input placeholder="e-mail" type="email" name="email" />
        <Input placeholder={'senha'} type="password" name="password" />

        <Stack direction="row" justifyContent="center" spacing={1}>
          {onForgot ? (
            <Button color="primary" variant="text" type="button" disabled={!!loading} onClick={onForgot}>
              {'Esqueci a senha'}
            </Button>
          ) : null}
          <Button color="primary" variant="contained" type="submit" disabled={!!loading}>
            {'Enviar'}
          </Button>
        </Stack>
      </Form>
      {loading ? <CircleLoading color="#f00" /> : null}
    </>
  )
}
