import React, { useState, useCallback, useRef } from 'react'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import { Form } from '@unform/web'
import { number, object } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { Input } from '~/components/forms/UnForm/Input'
import { validateFormData } from '~/helpers/validation'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { IRanking } from '~/server-side/useCases/ranking/ranking.dto'
import { findRankings, storeRanking } from '~/services/api/ranking'

const schema = object().shape({
  points: number().required('Posntos são requeridos')
})

export type SuccessHandler = (userIds?: string[], points?: number) => void

export type FormData = {
  points: number
}
type Props = {
  categoryId: number
  userIds: string[]
  onCancel?: () => void
  onSuccess?: SuccessHandler
  // onFailed?: (message: string) => void
  onInvalid?: (data: Record<keyof FormData, string>) => void
}
export const FormPairRanking: React.FC<Props> = ({ categoryId, userIds = [], onInvalid, onSuccess, onCancel }) => {
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Partial<IRanking>[]>([])

  const fetchData = useCallback(async () => {
    if (userIds && userIds?.length > 0) {
      setLoading(true)
      const response = await findRankings(categoryId, { userId: userIds })
      setLoading(false)
      if (response?.success) {
        if (response?.rankings?.length > 0) setData(response?.rankings)
      } else {
        toast.error(response?.message || 'Erro ao recuperar ranking')
      }
    }
  }, [categoryId, userIds])

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      const invalid = await validateFormData(schema, formData, formRef.current)
      if (invalid) {
        if (onInvalid) onInvalid(invalid)
        Object.entries(invalid).forEach(([_k, v]) => toast.error(v))
        return null
      }

      setLoading(true)
      const save = userIds.map(userId => {
        const found = data.find(f => f.userId === userId && f.categoryId === categoryId)
        return found ? { id: found.id, userId, categoryId } : { userId, categoryId }
      })
      const response = (
        await Promise.all(
          save?.map(async d => {
            const r = await storeRanking({ ...d, ...formData })
            if (r?.success) return null
            return r
          })
        )
      ).filter(f => !!f)
      setLoading(false)

      if (!response?.length) {
        toast.success('Ranking salvo com sucesso!')
        if (onSuccess) onSuccess(userIds, formData?.points)
      }
    },
    [onInvalid, onSuccess, userIds, categoryId, data]
  )

  useOnceCall(() => {
    fetchData()
  })

  return (
    <>
      <Form ref={formRef} onSubmit={handleSubmit} role="form" initialData={data[0] || {}} key={`form-${data[0]?.id || ''}`}>
        {data?.map(r => {
          return <p key={r.userId}>{r?.user?.name}</p>
        })}
        <Divider />
        <Input placeholder="pontos" type="number" name="points" label="Pontos" />
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
