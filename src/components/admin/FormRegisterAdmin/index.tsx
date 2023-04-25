import { useCallback, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { Button, Grid, Stack, Typography } from '@mui/material'
import { Form } from '@unform/web'
import { cpf } from 'cpf-cnpj-validator'
import { sub } from 'date-fns'
import * as Yup from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { InputSelects } from '~/components/forms/InputSelects'
import { InputMask, InputText } from '~/components/forms/InputText'
import { InputDate } from '~/components/forms/UnForm/InputDate'
import { FlexContainer } from '~/components/styled'
import { useUserAuth } from '~/components/UserProvider'
import { genders, shirtSizes } from '~/config/constants'
import { validateFormData } from '~/helpers/validation'
import { useAppAuth } from '~/hooks/useAppAuth'
import { useIsMounted } from '~/hooks/useIsMounted'
import { UserGender } from '~/server-side/useCases/user/user.dto'
import { createUser } from '~/services/api/user'

const schema = Yup.object().shape({
  name: Yup.string().required('Seu nome é obrigatório'),
  email: Yup.string().required('Seu e-mail é obrigatório'),
  phone: Yup.string(),
  cpf: Yup.string().test('cpf', 'CPF inválido', value => (value ? cpf.isValid(value) : true)),
  shirtSize: Yup.string().required('O tamanho da camisa é obrigatório'),
  birday: Yup.string().required('A sua data de nascimento é obrigatória'),
  password: Yup.string().required('Por favor digite  a senha').min(6, 'A senha deve ter ao menos 6 dígitos'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Senha e confirmar senha não batem'),
  gender: Yup.string().required('gênero é requirido')
})

interface FormData {
  name: string
  email: string
  phone: string
  cpf: string
  shirtSize: string
  birday: string
  password: string
  confirmPassword: string
  gender: UserGender
}

interface Props {
  onSuccess?: () => void
  onCancel?: () => void
}

export const FormRegisterAdmin: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const { isAdmin } = useAppAuth()
  const { loading: loadingUser } = useUserAuth()

  const [loading, setLoading] = useState(false)

  const isMounted = useIsMounted()
  const formRef = useRef()

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      const invalid = await validateFormData(schema, { ...formData }, formRef.current)
      if (invalid) return null

      const data = { ...formData, confirmPassword: undefined }

      setLoading(true)

      const response = await createUser(data)

      if (isMounted()) {
        if (response?.success) {
          toast.success('Informações gravadas')
          onSuccess?.()
        } else toast.error(response?.message || 'Erro ao salvar')
      }

      setLoading(false)
    },
    [onSuccess, isMounted]
  )

  if (!loadingUser && !isAdmin) return null

  return (
    <>
      <Form ref={formRef} onSubmit={handleSubmit} role="form">
        <Grid container>
          <Grid item xs={12} lg={6}>
            <InputText name="name" label="Nome *" />
          </Grid>
          <Grid item xs={12} lg={6}>
            <InputText name="email" label="e-mail *" />
          </Grid>
          <Grid item xs={12} lg={6}>
            <InputText type="password" name="password" label="Senha *" />
          </Grid>
          <Grid item xs={12} lg={6}>
            <InputText type="password" name="confirmPassword" label="Confirmar senha *" />
          </Grid>
          <Grid item xs={12} lg={6}>
            <InputDate name="birday" label="Data de nascimento *" maxDate={sub(new Date(), { years: 5 })} minDate={sub(new Date(), { years: 75 })} />
          </Grid>
          <Grid item xs={12} pb={2}>
            <Typography variant="h6">Informações Opcionais</Typography>
          </Grid>
          <Grid item xs={12} lg={6}>
            <InputText name="nick" label="Apelido no BT" />
          </Grid>
          <Grid item xs={12} lg={6}>
            <InputMask name="cpf" label="CPF" mask={'999.999.999-99'} alwaysShowMask={false} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <InputMask name="phone" label="Telefone" mask={'(99) 9 9999-9999'} alwaysShowMask={false} />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} lg={6}>
            <FlexContainer justify="center" verticalPad={10}>
              <InputSelects name="shirtSize" label="Tamanho da camisa" options={shirtSizes} defaultSelected="M" />
            </FlexContainer>
          </Grid>
          <Grid item xs={12} lg={6}>
            <InputSelects name="gender" label="Sexo" options={genders} defaultSelected="M" />
            {/* <FlexContainer verticalPad={10}>
              <InputSelects name="category" label="Categoria" options={categories} defaultSelected={userData?.category || 'B'} />
            </FlexContainer> */}
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          {onCancel ? (
            <Button color="primary" variant="outlined" type="button" disabled={!!loadingUser || loading} onClick={onCancel}>
              Voltar
            </Button>
          ) : null}
          <Button color="primary" variant="contained" type="submit" disabled={!!loadingUser || loading}>
            Salvar
          </Button>
        </Stack>
      </Form>
      {loadingUser || loading ? <CircleLoading /> : null}
    </>
  )
}
