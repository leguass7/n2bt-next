import React, { useEffect, useMemo, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import { useRouter } from 'next/router'

import { MenuItemStyled } from '~/components/tables/cells/styles'
import { useTableActions } from '~/components/tables/TableActionsProvider'

import type { ITournamentActions } from '../Actions'

type Props = {
  tournamentId: number
}
export const MenuButton: React.FC<Props> = ({ tournamentId }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { push, prefetch } = useRouter()
  const { setCustom } = useTableActions<ITournamentActions>()

  const open = useMemo(() => Boolean(anchorEl), [anchorEl])

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => setAnchorEl(null)

  const handleClickRanking = () => {
    push(`/admin/tournaments/ranking?tournamentId=${tournamentId}`)
    handleCloseMenu()
  }

  const handleClickSubscriptions = () => {
    push(`/admin/tournaments/subscriptions?tournamentId=${tournamentId}`)
    handleCloseMenu()
  }

  const handleDelete = () => setCustom({ deleteId: tournamentId })
  const handleEdit = () => {
    setCustom({ editId: tournamentId })
    handleCloseMenu()
  }

  useEffect(() => {
    if (open) {
      prefetch(`/admin/tournaments/ranking?tournamentId=${tournamentId}`)
      prefetch(`/admin/tournaments/subscriptions?tournamentId=${tournamentId}`)
    }
  }, [prefetch, open, tournamentId])

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
        <MenuItemStyled onClick={handleClickRanking} disableRipple>
          <MilitaryTechIcon /> Ranking
        </MenuItemStyled>
        <MenuItemStyled onClick={handleClickSubscriptions} disableRipple>
          <HowToRegIcon /> Inscrições
        </MenuItemStyled>
        <MenuItemStyled onClick={handleEdit} disableRipple>
          <EditIcon /> Alterar
        </MenuItemStyled>
        <MenuItemStyled onClick={handleDelete} disableRipple disabled>
          <DeleteIcon /> Remover
        </MenuItemStyled>
      </Menu>
    </>
  )
}
