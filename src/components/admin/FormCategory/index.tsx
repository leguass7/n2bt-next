import React, { useCallback, useRef, useState } from 'react'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { Form } from '@unform/web'
import { object, string } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { Input } from '~/components/forms/UnForm/Input'
import { validateFormData } from '~/helpers/validation'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { ICategory, IResponseCategory } from '~/server-side/useCases/category/category.dto'
import { getCategory, storeCategory } from '~/services/api/category'

type FormData = Partial<ICategory> & {}

type SuccessReason = 'edit' | 'create'

export type SuccessHandler = (reason: SuccessReason, response?: IResponseCategory) => void

const schema = object().shape({
  title: string().required('titulo da categoria requerido'),
  description: string()
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
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Partial<ICategory>>(null)

  const fetchData = useCallback(async () => {
    if (categoryId && categoryId > 0) {
      setLoading(true)
      const response = await getCategory(categoryId)
      setLoading(false)
      if (response?.success) {
        setData(response?.category)
      }
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
      <Form ref={formRef} onSubmit={handleSubmit} role="form" initialData={data} key={`form-${data?.id || ''}`}>
        <Input placeholder="nome" type="text" name="title" label="Nome" />
        <Input placeholder="descrição" type="text" multiline name="description" label="Descrição" />
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
