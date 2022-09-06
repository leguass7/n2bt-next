import React, { useEffect, useMemo, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PaidIcon from '@mui/icons-material/Paid'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import { useRouter } from 'next/router'

import { MenuItemStyled } from '~/components/tables/cells/styles'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { fileDownload } from '~/helpers/dom'
import { getDownloadUsers } from '~/services/api/user'

import type { IUserActions } from '../Actions'

type FunctionItem = (...any: any[]) => any
type Props = {
  useId: string
  enableDelete?: boolean
}
export const MenuButton: React.FC<Props> = ({ useId, enableDelete }) => {
  const [downloading, setDownloading] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { push, prefetch } = useRouter()
  const { setCustom } = useTableActions<IUserActions>()

  const open = useMemo(() => Boolean(anchorEl), [anchorEl])

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => setAnchorEl(null)

  const withClick = (fn: FunctionItem, wait?: boolean): React.MouseEventHandler<HTMLLIElement> => {
    return async e => {
      e.preventDefault()
      e.stopPropagation()
      if (fn) {
        if (wait) await fn()
        else fn()
      }

      handleCloseMenu()
    }
  }

  const handleClickPayment = () => push(`/admin/users/payments?useId=${useId}`)
  const handleDelete = () => setCustom({ deleteId: useId })

  const handleEdit = () => {
    setCustom({ editId: useId })
    handleCloseMenu()
  }

  const handleDownload: React.MouseEventHandler<HTMLLIElement> = async () => {
    setDownloading(true)
    const file = await getDownloadUsers({ page: 1, size: 1000, order: 'asc', orderby: 'name' })
    if (file) fileDownload(file, `atletas.xlsx`)
    setDownloading(false)
  }

  useEffect(() => {
    if (open) {
      prefetch(`/admin/users/payments?useId=${useId}`)
    }
  }, [prefetch, open, useId])

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleOpenMenu}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu id="long-menu" MenuListProps={{ 'aria-labelledby': 'long-button' }} anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        <MenuItemStyled onClick={withClick(handleClickPayment)} disableRipple>
          <PaidIcon /> Pagamentos
        </MenuItemStyled>
        {/* <MenuItemStyled onClick={withClick(handleClickSubscriptions)} disableRipple>
          <HowToRegIcon /> Inscrições
        </MenuItemStyled> */}
        {/* <MenuItemStyled onClick={withClick(handleClickSubCards)} disableRipple>
          <GroupIcon /> Inscrições agrupadas
        </MenuItemStyled> */}
        <Divider />
        <MenuItemStyled onClick={withClick(handleDownload, true)} disableRipple disabled={!!downloading}>
          <ListItemIcon>{downloading ? <CircularProgress size={22} /> : <DownloadIcon />}</ListItemIcon>
          <ListItemText primary="Baixar inscrições" secondary="Download no Excel" />
        </MenuItemStyled>
        <Divider />
        <MenuItemStyled onClick={withClick(handleEdit)} disableRipple>
          <EditIcon /> Alterar
        </MenuItemStyled>
        <MenuItemStyled onClick={withClick(handleDelete)} disableRipple disabled={!enableDelete}>
          <DeleteIcon /> Remover
        </MenuItemStyled>
      </Menu>
    </>
  )
}
