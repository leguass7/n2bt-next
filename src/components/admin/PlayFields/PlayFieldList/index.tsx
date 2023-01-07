import { useCallback, useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'

import { CircleLoading } from '~/components/CircleLoading'
import { SimpleModal } from '~/components/Common/SimpleModal'
import { useIsMounted } from '~/hooks/useIsMounted'
import type { PlayField } from '~/server-side/useCases/play-field/play-field.entity'
import { listPlayFieldInArena } from '~/services/api/play-field'
import { Content } from '~/styles'

import { PlayFieldDelete } from '../PlayFieldDelete'
import { PlayFieldForm } from '../PlayFieldForm'
import { PlayFieldItem } from './PlayFieldItem'
import { PlayFieldListHeader } from './PlayFieldListHeader'

interface Props {
  children?: React.ReactNode
  arenaId: number
}

export const PlayFieldList: React.FC<Props> = ({ arenaId }) => {
  const [fields, setFields] = useState<PlayField[]>([])

  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  const [fieldId, setFieldId] = useState(null)
  const [openFormModal, setOpenFormModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const fetchData = useCallback(async () => {
    if (!arenaId) return null
    setLoading(true)

    const { data = [] } = await listPlayFieldInArena(arenaId)

    if (isMounted()) {
      setLoading(false)
      if (data?.length) setFields(data)
    }
  }, [isMounted, arenaId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const toggleFormModal = useCallback(() => setOpenFormModal(old => !old), [])
  const toggleDeleteModal = useCallback(() => setOpenDeleteModal(old => !old), [])

  const handleEdit = useCallback(
    (id?: number) => {
      setFieldId(id)
      toggleFormModal()
    },
    [toggleFormModal]
  )

  const handleDelete = useCallback(
    (id?: number) => {
      setFieldId(id)
      toggleDeleteModal()
    },
    [toggleDeleteModal]
  )

  const handleCloseForm = useCallback(() => {
    setFieldId(null)
    fetchData()

    toggleFormModal()
  }, [toggleFormModal, fetchData])

  const handleCloseDelete = useCallback(() => {
    setFieldId(null)
    fetchData()

    toggleDeleteModal()
  }, [toggleDeleteModal, fetchData])

  return (
    <Content>
      <PlayFieldListHeader onReload={fetchData} onAdd={toggleFormModal} />

      <Grid container py={4} spacing={3}>
        {fields?.length
          ? fields.map(({ id, ...rest }) => {
              return (
                <>
                  <Grid item py={2} xs={12} sm={6} md={4} key={`field-${id}`}>
                    <PlayFieldItem id={id} onEdit={handleEdit} onDelete={handleDelete} {...rest} />
                  </Grid>
                </>
              )
            })
          : null}
      </Grid>

      <SimpleModal open={openFormModal} onToggle={handleCloseForm} title="Criar/Editar campo">
        <PlayFieldForm arenaId={arenaId} onSuccess={handleCloseForm} fieldId={fieldId} />
      </SimpleModal>
      <SimpleModal open={openDeleteModal} onToggle={handleCloseDelete} title="Deseja mesmo excluir esse campo?">
        <PlayFieldDelete onSuccess={handleCloseDelete} fieldId={fieldId} />
      </SimpleModal>

      {loading ? <CircleLoading /> : null}
    </Content>
  )
}
