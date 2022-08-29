import React, { useCallback, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import CheckIcon from '@mui/icons-material/Check'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { Form } from '@unform/web'
import { object, ref, string } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { BoxCenter, H4 } from '~/components/styled'
import { useUserAuth } from '~/components/UserProvider'
import { validateFormData } from '~/helpers/validation'
import { IUser } from '~/server-side/useCases/user/user.dto'
import { createUser, saveMe } from '~/services/api/user'

import { InputText } from '../../InputText'

type FormData = IUser & { confirmPassword: string }

export type Props = {
  onCancel?: () => void
  userId?: string
}

export const FormSignup: React.FC<Props> = ({ onCancel, userId }) => {
  const { loading: loadingUser, authenticated } = useUserAuth()

  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState(false)

  const formRef = useRef()

  const formSchema = useMemo(
    () =>
      object().shape({
        name: string().required('Seu nome é obrigatório'),
        email: string().required('Seu e-mail é obrigatório'),
        // phone: string().required('Seu telefone é obrigatório'),
        password: authenticated ? string() : string().required('A senha é obrigatória'),
        confirmPassword: string().oneOf([ref('password'), null], 'Senha e confirmar senha não batem')
        // cpf: string().test('cpf', 'CPF inválido', value => (value ? cpf.isValid(value) : true))
        // shirtSize: string().required('O tamanho da camisa é obrigatório'),
        // birday: string().required('A sua data de nascimento é obrigatória'),
        // category: string().required('Categoria é requirido'),
        // gender: string().required('gênero é requirido'),
        // cpf: string().required('CPF é requirido')
      }),
    [authenticated]
  )

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      const invalid = await validateFormData(formSchema, { ...formData }, formRef.current)
      if (!invalid) {
        setSaving(true)
        if (formData?.confirmPassword) delete formData.confirmPassword

        const save = authenticated && userId ? saveMe : createUser
        const response = await save(formData)

        if (!response || !response?.success) {
          toast.error(response?.message || 'Erro ao salvar')
        } else {
          setCreated(!!response?.userId)
          toast.success('Informações gravadas')
        }
        setSaving(false)
      } else {
        Object.entries(invalid).forEach(([, message]) => {
          toast.error(message)
        })
      }
    },
    [authenticated, formSchema, userId]
  )

  const handleCancel = useCallback(() => {
    setCreated(false)
    onCancel?.()
  }, [onCancel])

  return !!created ? (
    <BoxCenter>
      <CheckIcon /> Cadastro efetuado com sucesso!
      <br />
      <Button color="primary" variant="text" onClick={handleCancel}>
        Voltar
      </Button>
    </BoxCenter>
  ) : (
    <>
      <H4 align="center" transform="uppercase">
        Cadastre-se
      </H4>
      <Form ref={formRef} onSubmit={handleSubmit} role="form">
        <InputText name="name" label="Nome *" />
        <InputText name="email" label="e-mail *" />
        <InputText type="password" name="password" label="senha *" />
        <InputText type="password" name="confirmPassword" label="Confirmar senha *" />

        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          {onCancel ? (
            <Button color="primary" variant="outlined" type="button" disabled={!!loadingUser || saving} onClick={handleCancel}>
              Voltar
            </Button>
          ) : null}
          <Button color="primary" variant="contained" type="submit" disabled={!!loadingUser || saving}>
            Enviar
          </Button>
        </Stack>
      </Form>
      {loadingUser ? <CircleLoading /> : null}
    </>
  )
}
