import React, { useCallback, useRef, useState } from 'react'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { Form } from '@unform/web'
import { parseJSON } from 'date-fns'
import { date, object, ref, string } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { Input } from '~/components/forms/UnForm/Input'
import { InputDate } from '~/components/forms/UnForm/InputDate'
import { validateFormData } from '~/helpers/validation'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { IResponseTournament, ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { getTournament, storeTournament } from '~/services/api/tournament'

type FormData = Partial<ITournament> & {}

type SuccessReason = 'edit' | 'create'

export type SuccessHandler = (reason: SuccessReason, response?: IResponseTournament) => void

const schema = object().shape({
  title: string().required('titulo do torneio requerido'),
  description: string(),
  subscriptionStart: date().nullable(),
  subscriptionEnd: date().nullable().min(ref('subscriptionStart'), 'Fim das inscrições é menor do que o início delas')
})

export type FormTournamentProps = {
  arenaId?: number
  tournamentId?: number
  onCancel?: () => void
  onSuccess?: SuccessHandler
  onFailed?: (message: string) => void
  onInvalid?: (data: Record<keyof FormData, string>) => void
}

export const FormTournament: React.FC<FormTournamentProps> = ({ onInvalid, onSuccess, onFailed, onCancel, tournamentId, arenaId }) => {
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Partial<ITournament>>(null)

  const fetchData = useCallback(async () => {
    if (tournamentId && tournamentId > 0) {
      setLoading(true)
      const response = await getTournament(tournamentId)
      setLoading(false)
      if (response?.success) {
        const tournament = {
          ...response?.tournament,
          subscriptionStart: parseJSON(response.tournament?.subscriptionStart),
          subscriptionEnd: parseJSON(response.tournament?.subscriptionEnd)
        }

        setData(tournament)
      }
    }
  }, [tournamentId])

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      const invalid = await validateFormData(schema, formData, formRef.current)
      if (invalid) {
        if (onInvalid) onInvalid(invalid)
        return null
      }

      setLoading(true)
      const response = await storeTournament({ id: tournamentId, arenaId, ...formData })

      setLoading(false)
      if (response?.success) {
        const reason: SuccessReason = tournamentId > 0 ? 'edit' : 'create'
        if (onSuccess) onSuccess(reason, response)
      } else {
        if (onFailed) onFailed(`${response?.message}`)
      }
    },
    [onInvalid, onSuccess, onFailed, tournamentId, arenaId]
  )

  useOnceCall(fetchData)
  // data.subscriptionExpiration

  return (
    <>
      <Form ref={formRef} onSubmit={handleSubmit} role="form" initialData={data} key={`form-${data?.id || ''}`}>
        <Input placeholder="nome" type="text" name="title" label="Nome" />
        <Input placeholder="descrição" type="text" multiline name="description" label="Descrição" />
        <Stack direction="column" spacing={1} pt={2}>
          <InputDate fullWidth label="Início das incrições" name="subscriptionStart" minDate={new Date()} clearable />
          <InputDate fullWidth label="Fim das incrições" name="subscriptionEnd" clearable />
        </Stack>

        {/* {tournamentId ? (
          <>{!loading && !!data ? <MuiInputDate name="subscriptionEnd" label={'Data limite inscrições'} /> : null}</>
        ) : (
          <MuiInputDate name="subscriptionEnd" label={'Data limite inscrições'} />
        )} */}

        <Stack direction="row" justifyContent="center" spacing={1} pt={2}>
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
