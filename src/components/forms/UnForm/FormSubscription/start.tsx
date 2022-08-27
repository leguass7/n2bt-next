import React, { useCallback, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { cpf } from 'cpf-cnpj-validator'
import { sub } from 'date-fns'
import { object, string } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { InputSelects } from '~/components/forms/InputSelects'
import { InputDate } from '~/components/forms/UnForm/InputDate'
import { FlexContainer } from '~/components/styled'
import { useUserAuth } from '~/components/UserProvider'
import { genders, shirtSizes } from '~/config/constants'
import { validateFormData } from '~/helpers/validation'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { IUser } from '~/server-side/useCases/user/user.dto'
import { saveMe } from '~/services/api/user'

import { InputMask } from '../../InputText'

type FormData = IUser & { confirmPassword: string }

export type Props = {
  onCancel?: () => void
}

const schema = object().shape({
  shirtSize: string().required('O tamanho da camisa é obrigatório'),
  birday: string().required('A sua data de nascimento é obrigatória'),
  // category: string().required('Categoria é requirido'),
  gender: string().required('gênero é requirido'),
  cpf: string()
    .required('CPF é obrigatório')
    .test('cpf', 'CPF inválido', value => (value ? cpf.isValid(value) : true))
})

export const FormSubscriptionStart: React.FC<Props> = ({ onCancel }) => {
  const [data, setData] = useState(null)
  const formRef = useRef<FormHandles>()
  const { loading: loadingUser, updateUserData, requestMe } = useUserAuth()
  const [saving, setSaving] = useState(false)

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      const invalid = await validateFormData(schema, { ...formData }, formRef.current)
      if (invalid) {
        Object.entries(invalid).forEach(([, message]) => toast.error(message))
        return null
      }
      setSaving(true)
      const response = await saveMe(formData)
      setSaving(false)
      if (!response || !response?.success) toast.error(response?.message || 'Erro ao salvar')
      else {
        toast.success('dados atualizados com sucesso')
        updateUserData({ ...formData })
      }
    },
    [updateUserData]
  )

  const fetchData = useCallback(async () => {
    const response = await requestMe()
    if (response?.success) {
      setData(response?.user)
    }
  }, [requestMe])

  useOnceCall(fetchData)

  return (
    <>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={data} key={`form-${data?.id}`} role="form">
        <InputDate name="birday" label="Data de nascimento *" maxDate={sub(new Date(), { years: 5 })} minDate={sub(new Date(), { years: 75 })} />
        <InputMask name="cpf" label="CPF" mask={'999.999.999-99'} alwaysShowMask={false} />
        {/* <FlexContainer verticalPad={10}>
          <InputSelects name="category" label="Categoria" options={categories} defaultSelected={userData?.category || 'C'} />
        </FlexContainer> */}
        <FlexContainer verticalPad={10}>
          <InputSelects name="shirtSize" label="Tamanho da camisa" options={shirtSizes} defaultSelected={data?.shirtSize || 'M'} />
        </FlexContainer>
        <FlexContainer verticalPad={10}>
          <InputSelects name="gender" label="Sexo" options={genders} defaultSelected={data?.gender || 'M'} />
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
