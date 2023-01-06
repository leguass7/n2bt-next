import React, { useCallback, useRef, useState } from 'react'

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { number, object, ref, string } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { InputSelects } from '~/components/forms/InputSelects'
import { Input } from '~/components/forms/UnForm/Input'
import { Switch } from '~/components/forms/UnForm/Switch'
import { FlexContainer } from '~/components/styled'
import { categoryGenders } from '~/config/constants'
import { validateFormData } from '~/helpers/validation'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { ICategory, IResponseCategory } from '~/server-side/useCases/category/category.dto'
import { getCategory, storeCategory } from '~/services/api/category'

type FormData = Partial<ICategory> & {}

type SuccessReason = 'edit' | 'create'

export type SuccessHandler = (reason: SuccessReason, response?: IResponseCategory) => void

const schema = object().shape({
  title: string().required('titulo da categoria requerido'),
  description: string(),
  minAge: number().min(3, 'Digite uma idade mínima acima de 3 anos').nullable(),
  maxAge: number().min(ref('minAge'), 'Idade máxima deve ser maior que idade mínima').nullable()
})

export type FormCategoryProps = {
  tournamentId?: number
  categoryId?: number
  onCancel?: () => void
  onSuccess?: SuccessHandler
  onFailed?: (message: string) => void
  onInvalid?: (data: Record<keyof FormData, string>) => void
}

export const FormCategory: React.FC<FormCategoryProps> = ({ onInvalid, onSuccess, onFailed, onCancel, categoryId, tournamentId }) => {
  const formRef = useRef<FormHandles>()
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    if (categoryId && categoryId > 0) {
      setLoading(true)
      const response = await getCategory(categoryId)
      setLoading(false)
      if (response?.success) formRef.current?.setData?.(response?.category)
    }
  }, [categoryId])

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      const invalid = await validateFormData(schema, formData, formRef.current)
      if (invalid) {
        if (onInvalid) onInvalid(invalid)
        return null
      }
      setLoading(true)
      const response = await storeCategory({ id: categoryId, tournamentId, ...formData })
      setLoading(false)
      if (response?.success) {
        const reason: SuccessReason = categoryId > 0 ? 'edit' : 'create'
        if (onSuccess) onSuccess(reason, response)
      } else {
        if (onFailed) onFailed(`${response?.message}`)
      }
    },
    [onInvalid, onSuccess, onFailed, categoryId, tournamentId]
  )

  useOnceCall(() => {
    fetchData()
  })

  return (
    <>
      <Form ref={formRef} onSubmit={handleSubmit} role="form">
        <FlexContainer verticalPad={10}>
          <InputSelects name="gender" label="Gênero" options={categoryGenders} defaultSelected={'M'} />
        </FlexContainer>
        <Grid container>
          <Grid item xs={6}>
            <Input type="text" name="title" label="Nome" />
          </Grid>
          <Grid item xs={6}>
            <Input number name="limit" label="Limite de atletas" />
          </Grid>
          <Grid item xs={12}>
            <Input type="text" multiline name="description" label="Descrição" />
          </Grid>
          <Grid item xs={12} pt={2}>
            <Typography variant="h6">Valor</Typography>
          </Grid>
          <Grid item xs={6}>
            <Input number name="price" label="Valor da inscrição" />
          </Grid>
          <Grid item xs={6}>
            <Input number name="discount" label="Desconto" />
          </Grid>

          <Grid item xs={12} pt={2}>
            <Typography variant="h6">Restrições</Typography>
          </Grid>

          <Grid item xs={6}>
            <Input number name="minAge" label="Idade mínima" />
          </Grid>
          <Grid item xs={6}>
            <Input number name="maxAge" label="Idade máxima" />
          </Grid>
        </Grid>

        <FlexContainer verticalPad={10}>
          <div>
            <Switch name="mixGender" label="Categoria mista" disabled />
          </div>
        </FlexContainer>

        <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 2 }}>
          {onCancel ? (
            <Button color="primary" variant="outlined" type="button" disabled={!!loading} onClick={onCancel}>
              {'Cancelar'}
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
