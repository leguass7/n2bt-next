import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import AddIcon from '@mui/icons-material/Add'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'

import { useCustomTable } from '~/components/CustomTable'
import { SearchFetchHandler, SearchUserDrawer, SelectHandler } from '~/components/SearchUserDrawer'
import { FlexContainer } from '~/components/styled'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { storeRanking } from '~/services/api/ranking'
import { deleteRanking } from '~/services/api/ranking'
import { findUser } from '~/services/api/user'

export interface IRankingActions {
  editId?: number
  deleteId?: number
  paymentId?: number
  selectList?: number[]
}

type Props = {
  tournamentId: number
  categoryId: number
  userList: string[]
}
export const Actions: React.FC<Props> = ({ tournamentId, categoryId, userList }) => {
  const [open, setOpen] = useState(false)
  const [, setAdded] = useState('-')
  const [loading, setLoading] = useState(false)
  const { custom, setCustom } = useTableActions<IRankingActions>()
  const { emitFetch } = useCustomTable()

  const handleClose = useCallback(() => {
    setCustom({ editId: 0, deleteId: 0, paymentId: 0 })
    setOpen(false)
  }, [setCustom])

  const search: SearchFetchHandler = useCallback(async filter => {
    const response = await findUser(filter)
    return response
  }, [])

  const handleSelect: SelectHandler = useCallback(
    async userId => {
      const response = await storeRanking({ tournamentId, categoryId, userId })
      if (!!response?.success) {
        setAdded(userId)
        toast.success('Usuário adicionado')
      } else {
        toast.error('Erro ao salvar')
      }
    },
    [tournamentId, categoryId]
  )

  const handleDelete = async () => {
    if (custom?.deleteId > 0) {
      setLoading(true)
      const response = await deleteRanking(custom.deleteId)
      if (!!response.success) {
        handleClose()
        toast.success('Ranking excluído com sucesso')
        emitFetch()
      }
      setLoading(false)
    }
  }

  const handleClickAdd = () => setOpen(true)

  // const title = custom?.editId > 0 ? `Alterar` : `Criar`

  return (
    <>
      <FlexContainer justify="center">
        <div></div>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <IconButton onClick={handleClickAdd}>
            <Tooltip title="Adicionar atleta ao Ranking" arrow>
              <AddIcon />
            </Tooltip>
          </IconButton>
        </Toolbar>
      </FlexContainer>
      <Divider />
      <SearchUserDrawer
        open={open}
        categoryId={categoryId}
        tournamentId={tournamentId}
        onClose={handleClose}
        fetcher={search}
        fixedFilter={{ tournamentId, categoryId }}
        userList={userList}
        onSelect={handleSelect}
      />
    </>
  )
}
