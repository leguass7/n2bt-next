import React, { useCallback, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { Grid } from '@mui/material'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { Form } from '@unform/web'
import { cpf } from 'cpf-cnpj-validator'
import { sub } from 'date-fns'
import { object, string } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { FlexContainer } from '~/components/styled'
import { useUserAuth } from '~/components/UserProvider'
import { genders, shirtSizes } from '~/config/constants'
import { validateFormData } from '~/helpers/validation'
import { useIsMounted } from '~/hooks/useIsMounted'
import { useOnceCall } from '~/hooks/useOnceCall'
import { IUser } from '~/server-side/useCases/user/user.dto'
import { findOneUser, saveMe, updateUser } from '~/services/api/user'

import { InputSelects } from '../../InputSelects'
import { InputMask, InputText } from '../../InputText'
import { InputDate } from '../InputDate'

type FormData = Omit<IUser, 'password'>

const schema = object().shape({
  name: string().required('Seu nome é obrigatório'),
  email: string().required('Seu e-mail é obrigatório'),
  phone: string(),
  cpf: string().test('cpf', 'CPF inválido', value => (value ? cpf.isValid(value) : true)),
  shirtSize: string().required('O tamanho da camisa é obrigatório'),
  birday: string().required('A sua data de nascimento é obrigatória'),
  // category: string().required('Categoria é requirido'),
  gender: string().required('gênero é requirido')
})

export type Props = {
  onCancel?: () => void
  userId?: string
}

/**
 * @function FormRegister
 * Se não tiver userId, pega as informações do usuário logado
 */
export const FormRegister: React.FC<Props> = ({ onCancel, userId }) => {
  const { loading: loadingUser, userData, updateUserData, requestMe, authenticated } = useUserAuth()

  const formRef = useRef()

  const [data, setData] = useState<Partial<IUser>>({})

  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  const fetchData = useCallback(async () => {
    if (!authenticated) return
    setLoading(true)

    const find = userId ? () => findOneUser({ id: userId }) : requestMe
    const { success = false, user, message = 'Usuário não encontrado' } = await find()

    if (isMounted()) {
      setLoading(false)
      if (!success) toast.error(message)
      setLoading(false)
    }

    if (user) setData({ ...user })
  }, [requestMe, isMounted, authenticated, userId])

  useOnceCall(fetchData)

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      if (authenticated && userData && userData?.id) {
        const invalid = await validateFormData(schema, { ...formData }, formRef.current)
        if (!invalid) {
          setLoading(true)

          const response = userId ? await updateUser(userId, formData) : await saveMe(formData)

          if (response?.success) {
            toast.success('Informações gravadas')
            updateUserData({ ...formData })
          } else toast.error(response?.message || 'Erro ao salvar')

          setLoading(false)
        } else {
          Object.entries(invalid).forEach(([, message]) => {
            toast.error(message)
          })
        }
      }
    },
    [authenticated, userData, updateUserData, userId]
  )

  return (
    <>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={data} key={`form-${data.id}`} role="form">
        <Grid container>
          <Grid item xs={12} sm={6}>
            <InputText name="name" label="Nome *" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputText name="email" label="e-mail *" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputText name="nick" label="Apelido no BT" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputDate name="birday" label="Data de nascimento *" maxDate={sub(new Date(), { years: 5 })} minDate={sub(new Date(), { years: 75 })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputMask name="cpf" label="CPF" mask={'999.999.999-99'} alwaysShowMask={false} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputMask name="phone" label="Telefone" mask={'(99) 9 9999-9999'} alwaysShowMask={false} />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} sm={6}>
            <FlexContainer justify="center" verticalPad={10}>
              <InputSelects name="shirtSize" label="Tamanho da camisa" options={shirtSizes} defaultSelected={userData?.shirtSize || 'M'} />
            </FlexContainer>
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* <FlexContainer verticalPad={10}>
              <InputSelects name="category" label="Categoria" options={categories} defaultSelected={userData?.category || 'B'} />
            </FlexContainer> */}
          </Grid>
        </Grid>

        <FlexContainer verticalPad={10}>
          <InputSelects name="gender" label="Sexo" options={genders} defaultSelected={userData?.gender || 'M'} />
        </FlexContainer>

        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          {onCancel ? (
            <Button color="primary" variant="outlined" type="button" disabled={!!loadingUser || loading} onClick={onCancel}>
              Voltar
            </Button>
          ) : null}
          <Button color="primary" variant="contained" type="submit" disabled={!!loadingUser || loading}>
            Enviar
          </Button>
        </Stack>
      </Form>
      {loadingUser || loading ? <CircleLoading /> : null}
    </>
  )
}
