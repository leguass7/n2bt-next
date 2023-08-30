import React, { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { Form } from '@unform/web'

import { CircleLoading } from '~/components/CircleLoading'
import Select, { type SelectItem } from '~/components/forms/UnForm/Select'
import type { ICategory } from '~/server-side/useCases/category/category.dto'
import { listCategories } from '~/services/api/category'

type Items = SelectItem[]
export type FormData = {
  categoryId?: number
}

function dto(d: ICategory[] = []): Items {
  return d.map(cat => {
    return {
      label: `${cat.title} ${cat?.gender}`,
      value: cat.id
    }
  })
}

type Props = {
  tournamentId: number
  onCancel?: () => any
  onSubmit?: (data?: FormData) => Promise<any>
}
export const FormTranferCategory: React.FC<Props> = ({ tournamentId, onCancel, onSubmit }) => {
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Items>(null)

  const fetchData = useCallback(async () => {
    if (tournamentId > 0) {
      setLoading(true)
      const response = await listCategories(tournamentId)
      setLoading(false)
      if (response?.success) {
        setCategories(dto(response?.categories))
      }
    } else {
      toast.error('Nenum torneio selecionado')
      if (onCancel) onCancel()
    }
  }, [tournamentId, onCancel])

  const handleSubmit = async (formData: FormData) => {
    if (onSubmit) {
      setLoading(true)
      const r = await onSubmit(formData)
      setLoading(false)
      return r
    }
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Form ref={formRef} onSubmit={handleSubmit} role="form" initialData={{}} key={`form-${categories?.length || ''}`}>
      <Select name="categoryId" items={categories} label="Categorias" />
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
      {loading ? <CircleLoading /> : null}
    </Form>
  )
}
