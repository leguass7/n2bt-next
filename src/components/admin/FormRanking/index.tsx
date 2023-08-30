import React, { useCallback, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { type FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { number, object } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { Input } from '~/components/forms/UnForm/Input'
import { validateFormData } from '~/helpers/validation'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { IRanking, IResponseRanking } from '~/server-side/useCases/ranking/ranking.dto'
import { getRanking, storeRanking } from '~/services/api/ranking'

type FormData = Partial<IRanking> & {}

type SuccessReason = 'edit' | 'create'

export type SuccessHandler = (reason: SuccessReason, response?: IResponseRanking) => void

const schema = object().shape({
  points: number().required('Posntos são requeridos')
})

export type FormRankingProps = {
  rankingId?: number
  onCancel?: () => void
  onSuccess?: SuccessHandler
  onFailed?: (message: string) => void
  onInvalid?: (data: Record<keyof FormData, string>) => void
}

export const FormRanking: React.FC<FormRankingProps> = ({ onInvalid, onSuccess, onFailed, onCancel, rankingId }) => {
  const formRef = useRef<FormHandles>()
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    if (rankingId && rankingId > 0) {
      setLoading(true)
      const response = await getRanking(rankingId)
      setLoading(false)

      if (response?.success) formRef.current.setData(response?.ranking)
      else toast.error(response?.message || 'Erro ao recuperar ranking')
    }
  }, [rankingId])

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      const invalid = await validateFormData(schema, formData, formRef.current)
      if (invalid) {
        if (onInvalid) onInvalid(invalid)
        return null
      }
      setLoading(true)
      const response = await storeRanking({ id: rankingId, ...formData })
      setLoading(false)
      if (response?.success) {
        const reason: SuccessReason = rankingId > 0 ? 'edit' : 'create'
        if (onSuccess) onSuccess(reason, response)
      } else {
        if (onFailed) onFailed(`${response?.message}`)
      }
    },
    [onInvalid, onSuccess, onFailed, rankingId]
  )

  useOnceCall(() => {
    fetchData()
  })

  return (
    <>
      <Form ref={formRef} onSubmit={handleSubmit} role="form">
        <Input type="number" name="points" label="Pontos" />
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
