import React, { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { sub } from 'date-fns'
import { object, string } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { InputDate } from '~/components/forms/InputDate'
import { InputSelects } from '~/components/forms/InputSelects'
import { FlexContainer } from '~/components/styled'
import { useUserAuth } from '~/components/UserProvider'
import { genders, shirtSizes } from '~/config/constants'
import { validateFormData } from '~/helpers/validation'
import { IUser } from '~/server-side/useCases/user/user.dto'
import { saveMe } from '~/services/api/user'

type FormData = IUser & { confirmPassword: string }

export type Props = {
  onCancel?: () => void
}

const schema = object().shape({
  shirtSize: string().required('O tamanho da camisa é obrigatório'),
  birday: string().required('A sua data de nascimento é obrigatória'),
  // category: string().required('Categoria é requirido'),
  gender: string().required('gênero é requirido')
})

export const FormSubscriptionStart: React.FC<Props> = ({ onCancel }) => {
  const { loading: loadingUser, userData, updateUserData } = useUserAuth()

  const [saving, setSaving] = useState(false)

  const formRef = useRef<FormHandles>()

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      if (!userData?.id) return null

      const invalid = await validateFormData(schema, { ...formData }, formRef.current)
      if (invalid) {
        Object.entries(invalid).forEach(([, message]) => {
          toast.error(message)
        })

        return null
      }

      setSaving(true)

      const response = await saveMe(formData)

      if (!response || !response?.success) toast.error(response?.message || 'Erro ao salvar')
      else {
        toast.success('dados atualizados com sucesso')
        updateUserData({ ...formData })
      }

      setSaving(false)
    },
    [userData?.id, updateUserData]
  )

  const updateForm = useCallback(() => {
    if (userData) formRef.current?.setData?.({ ...userData })
  }, [userData])

  useEffect(() => {
    updateForm()
  }, [updateForm])

  return (
    <>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={{ ...userData }} key={`form-${userData?.id}`} role="form">
        <InputDate name="birday" label="Data de nascimento *" maxDate={sub(new Date(), { years: 5 })} minDate={sub(new Date(), { years: 75 })} />
        {/* <FlexContainer verticalPad={10}>
          <InputSelects name="category" label="Categoria" options={categories} defaultSelected={userData?.category || 'C'} />
        </FlexContainer> */}
        <FlexContainer verticalPad={10}>
          <InputSelects name="shirtSize" label="Tamanho da camisa" options={shirtSizes} defaultSelected={userData?.shirtSize || 'M'} />
        </FlexContainer>
        <FlexContainer verticalPad={10}>
          <InputSelects name="gender" label="Sexo" options={genders} defaultSelected={userData?.gender || 'M'} />
        </FlexContainer>

        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          {onCancel ? (
            <Button color="primary" variant="outlined" type="button" disabled={!!loadingUser || saving} onClick={onCancel}>
              Voltar
            </Button>
          ) : null}
          <Button color="primary" variant="outlined" type="submit" disabled={!!loadingUser || saving}>
            Atualizar
          </Button>
        </Stack>
      </Form>
      {loadingUser || saving ? <CircleLoading /> : null}
    </>
  )
}
