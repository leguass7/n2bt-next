import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { Button, Grid } from '@mui/material'
import { type FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { Input } from '~/components/forms/UnForm/Input'
import { Timepicker } from '~/components/forms/UnForm/TimePicker'
import { validateFormData } from '~/helpers/validation'
import { useIsMounted } from '~/hooks/useIsMounted'
import type { CreatePlayFieldDTO } from '~/server-side/useCases/play-field/dto/create-play-field.dto'
import { createPlayField, getPlayField, updatePlayField } from '~/services/api/play-field'

interface Props {
  fieldId?: number
  arenaId: number
  onSuccess?: () => void
}

export type PlayFieldFormData = Omit<CreatePlayFieldDTO, 'createdBy' | 'updatedBy'>

const schema = Yup.object({
  arenaId: Yup.number().integer().positive(),
  interval: Yup.number().integer(),
  startDate: Yup.date().required('Horário de início é obrigatório'),
  endDate: Yup.date().required('Horário de fim é obrigatório'),
  label: Yup.string().required('Nome do campo é obrigátório'),
  price: Yup.number()
})

export const PlayFieldForm: React.FC<Props> = ({ fieldId, arenaId, onSuccess }) => {
  const formRef = useRef<FormHandles>(null)

  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  const fetchData = useCallback(async () => {
    if (!fieldId) return null
    setLoading(true)

    const { data = {} } = await getPlayField(fieldId)
    if (isMounted()) {
      setLoading(false)
      formRef.current.setData(data)
    }
  }, [fieldId, isMounted])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSubmit = useCallback(
    async (formData: PlayFieldFormData) => {
      const isInvalid = await validateFormData(schema, formData, formRef.current)
      if (isInvalid) return null

      setLoading(true)
      const data = { ...formData, arenaId }

      const { message = null } = fieldId ? await updatePlayField(fieldId, data) : await createPlayField(data)

      if (isMounted()) {
        setLoading(false)
        onSuccess?.()

        if (message) toast(message, { type: !!data ? 'success' : 'error' })
      }
    },
    [onSuccess, isMounted, fieldId, arenaId]
  )

  return (
    <>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12} py={2}>
            <Input name="label" label="Nome do campo" />
          </Grid>
          <Grid item xs={12} sm={6} py={1}>
            <Input name="price" number label="Preço da reserva" />
          </Grid>
          <Grid item xs={12} sm={6} py={1}>
            <Input name="interval" number label="tempo de reserva (em minutos)" />
          </Grid>
          <Grid item xs={12} sm={6} py={1}>
            <Timepicker inputFormat="HH:mm" name="startDate" label="horário de início" />
          </Grid>
          <Grid item xs={12} sm={6} py={1}>
            <Timepicker inputFormat="HH:mm" name="endDate" label="horário de fim" />
          </Grid>

          <Grid item xs={12}>
            <Grid container justifyContent="center" alignItems="center">
              <Button type="submit" variant="contained">
                Enviar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Form>
      {loading ? <CircleLoading /> : null}
    </>
  )
}
