import React, { useCallback, useRef, useState } from 'react'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { object, string } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { Input } from '~/components/forms/UnForm/Input'
import { validateFormData } from '~/helpers/validation'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { IArena, IResponseArena } from '~/server-side/useCases/arena/arena.dto'
import { getArena, storeArena } from '~/services/api/arena'

type FormData = Partial<IArena> & {}

type SuccessReason = 'edit' | 'create'

export type SuccessHandler = (reason: SuccessReason, response?: IResponseArena) => void

const schema = object().shape({
  title: string().required('titulo da arena requerido'),
  description: string()
})

export type FormArenaProps = {
  arenaId?: number
  onCancel?: () => void
  onSuccess?: SuccessHandler
  onFailed?: (message: string) => void
  onInvalid?: (data: Record<keyof FormData, string>) => void
}

export const FormArena: React.FC<FormArenaProps> = ({ onInvalid, onSuccess, onFailed, onCancel, arenaId }) => {
  const formRef = useRef<FormHandles>()
  const [loading, setLoading] = useState(false)
  // const [data, setData] = useState<Partial<IArena>>(null)

  const fetchData = useCallback(async () => {
    if (arenaId && arenaId > 0) {
      setLoading(true)
      const response = await getArena(arenaId)
      setLoading(false)
      if (response?.success) {
        formRef.current.setData(response?.arena)
        // setData(response?.arena)
      }
    }
  }, [arenaId])

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      const invalid = await validateFormData(schema, formData, formRef.current)
      if (invalid) {
        if (onInvalid) onInvalid(invalid)
        return null
      }
      setLoading(true)
      const response = await storeArena({ id: arenaId, ...formData })
      setLoading(false)
      if (response?.success) {
        const reason: SuccessReason = arenaId > 0 ? 'edit' : 'create'
        if (onSuccess) onSuccess(reason, response)
      } else {
        if (onFailed) onFailed(`${response?.message}`)
      }
    },
    [onInvalid, onSuccess, onFailed, arenaId]
  )

  useOnceCall(() => {
    fetchData()
  })

  return (
    <>
      <Form ref={formRef} onSubmit={handleSubmit} role="form">
        <Input type="text" name="title" label="Nome" />
        <Input type="text" name="description" label="Descrição" />
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
