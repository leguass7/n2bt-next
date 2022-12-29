import React, { useCallback, useRef, useState } from 'react'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { parseJSON } from 'date-fns'
import { date, object, ref, string } from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { Datetimepicker } from '~/components/forms/UnForm/Datetimepicker'
import { Input } from '~/components/forms/UnForm/Input'
import Select, { SelectItem } from '~/components/forms/UnForm/Select'
import { validateFormData } from '~/helpers/validation'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { IResponseTournament, ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { TournamentModality } from '~/server-side/useCases/tournament/tournament.dto'
import { getTournament, storeTournament } from '~/services/api/tournament'

type FormData = Partial<ITournament> & {}

type SuccessReason = 'edit' | 'create'

const modalities = Object.entries(TournamentModality).map<SelectItem>(([label, value]) => {
  return { label: label?.replaceAll?.(/_/g, ' '), value }
})

export type SuccessHandler = (reason: SuccessReason, response?: IResponseTournament) => void

const schema = object().shape({
  title: string().required('titulo do torneio requerido'),
  description: string(),
  subscriptionStart: date().nullable().min(new Date(), 'A data de início não pode ser no passado'),
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
  const formRef = useRef<FormHandles>()
  const [loading, setLoading] = useState(false)
  // const [data, setData] = useState<Partial<ITournament>>(null)

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

        formRef.current?.setData?.(tournament)
        // setData(tournament)
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
      <Form ref={formRef} onSubmit={handleSubmit} role="form">
        <Input placeholder="nome" type="text" name="title" label="Nome" />
        <Input placeholder="descrição" type="text" multiline name="description" label="Descrição" />
        <br />
        <Select name="modality" items={modalities} label="Modalidade do torneio" />
        <Stack direction="column" spacing={1} pt={2}>
          <Datetimepicker label="Início das inscrições" name="subscriptionStart" minDate={new Date()} />
          <Datetimepicker label="Fim das inscrições" name="subscriptionEnd" />
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
