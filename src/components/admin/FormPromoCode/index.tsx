import React, { useCallback, useRef, useState } from 'react'

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import type { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { number, object, string } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { Input } from '~/components/forms/UnForm/Input'
import { validateFormData } from '~/helpers/validation'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { IResponsePromoCode, IPromoCode } from '~/server-side/useCases/promo-code/promo-code.dto'
import { getPromoCode, storePromoCode } from '~/services/api/promo-code'

type FormData = Partial<IPromoCode> & {}

type SuccessReason = 'edit' | 'create'

export type SuccessHandler = (reason: SuccessReason, response?: IResponsePromoCode) => void

const schema = object().shape({
  label: string().required('rótulo é requerido'),
  discount: number().min(0.01, 'Mínimo de desconto é 0.01 (1%)').max(1, 'Valor máximo é 1 (100%)').required('Desconto é obrigatório'),
  usageLimit: number().min(1, 'Limite mínimo é de 1 uso por código').max(10, 'Limite máximo é 10').required('Limite é obrigatório')
})

export type FormPromoCodeProps = {
  promoCodeId?: number
  tournamentId: number
  onCancel?: () => void
  onSuccess?: SuccessHandler
  onFailed?: (message: string) => void
  onInvalid?: (data: Record<keyof FormData, string>) => void
}

export const FormPromoCode: React.FC<FormPromoCodeProps> = ({ onInvalid, onSuccess, onFailed, onCancel, promoCodeId, tournamentId }) => {
  const formRef = useRef<FormHandles>()
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    if (promoCodeId && promoCodeId > 0) {
      setLoading(true)
      const response = await getPromoCode(promoCodeId)
      setLoading(false)
      if (response?.success) formRef.current?.setData?.(response?.promoCode)
    }
  }, [promoCodeId])

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      const invalid = await validateFormData(schema, formData, formRef.current)
      if (invalid) {
        if (onInvalid) onInvalid(invalid)
        return null
      }
      setLoading(true)
      const response = await storePromoCode({ id: promoCodeId, tournamentId, ...formData })
      setLoading(false)
      if (response?.success) {
        const reason: SuccessReason = promoCodeId > 0 ? 'edit' : 'create'
        if (onSuccess) onSuccess(reason, response)
      } else {
        if (onFailed) onFailed(`${response?.message}`)
      }
    },
    [onInvalid, onSuccess, onFailed, tournamentId, promoCodeId]
  )

  useOnceCall(() => {
    fetchData()
  })

  return (
    <>
      <Form ref={formRef} onSubmit={handleSubmit} role="form">
        <Grid container>
          <Grid item xs={6}>
            <Input type="text" name="label" label="Rótulo" />
          </Grid>
          <Grid item xs={6}>
            <Input number name="usageLimit" label="Limite de uso" />
          </Grid>
          <Grid item xs={6}>
            <Input number name="discount" label="Razão de desconto (ex: 0.5 = 50%)" />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 2 }}>
          {onCancel ? (
            <Button color="primary" variant="outlined" type="button" disabled={!!loading} onClick={onCancel}>
              {'Cancelar'}
            </Button>
          ) : null}
          <Button color="primary" variant="contained" type="submit" disabled={!!loading}>
            {'Salvar'}
          </Button>
        </Stack>
      </Form>
      {loading ? <CircleLoading /> : null}
    </>
  )
}
