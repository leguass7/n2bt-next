import React, { useEffect, useMemo, useState } from 'react'

import AssessmentIcon from '@mui/icons-material/Assessment'
import BeenhereIcon from '@mui/icons-material/Beenhere'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import GroupIcon from '@mui/icons-material/Group'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import MoreVertIcon from '@mui/icons-material/MoreVert'
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
import { getDownloadSubscriptions } from '~/services/api/subscriptions'

import type { ITournamentActions } from '../Actions'

type FunctionItem = (...any: any[]) => any
type Props = {
  tournamentId: number
}
export const MenuButton: React.FC<Props> = ({ tournamentId }) => {
  const [downloading, setDownloading] = useState(false)
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

  const handleClickCheckin = () => push(`/admin/tournaments/presence?tournamentId=${tournamentId}`)
  const handleClickRanking = () => push(`/admin/tournaments/ranking?tournamentId=${tournamentId}`)
  const handleClickSubscriptions = () => push(`/admin/tournaments/subscriptions?tournamentId=${tournamentId}`)
  const handleClickSubCards = () => push(`/admin/tournaments/sub-cards?tournamentId=${tournamentId}`)
  const handleClickReport = () => push(`/admin/tournaments/report?tournamentId=${tournamentId}`)
  const handleDelete = () => setCustom({ deleteId: tournamentId })

  const handleEdit = () => {
    setCustom({ editId: tournamentId })
    handleCloseMenu()
  }

  const handleDownload: React.MouseEventHandler<HTMLLIElement> = async () => {
    setDownloading(true)
    const file = await getDownloadSubscriptions(tournamentId)
    if (file) fileDownload(file, `download.xlsx`)
    setDownloading(false)
  }

  useEffect(() => {
    if (open) {
      prefetch(`/admin/tournaments/presence?tournamentId=${tournamentId}`)
      prefetch(`/admin/tournaments/ranking?tournamentId=${tournamentId}`)
      prefetch(`/admin/tournaments/subscriptions?tournamentId=${tournamentId}`)
      prefetch(`/admin/tournaments/sub-cards?tournamentId=${tournamentId}`)
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
        <MenuItemStyled onClick={withClick(handleClickCheckin)} disableRipple>
          <ListItemIcon>
            <BeenhereIcon />
          </ListItemIcon>
          <ListItemText primary="Checkin" secondary="Marcar presença no torneio" />
        </MenuItemStyled>
        <MenuItemStyled onClick={withClick(handleClickSubscriptions)} disableRipple>
          <HowToRegIcon /> Inscrições
        </MenuItemStyled>
        <MenuItemStyled onClick={withClick(handleClickReport)} disableRipple>
          <AssessmentIcon /> Relatório
        </MenuItemStyled>
        <MenuItemStyled onClick={withClick(handleClickSubCards)} disableRipple>
          <GroupIcon /> Inscrições agrupadas
        </MenuItemStyled>
        <MenuItemStyled onClick={withClick(handleClickRanking)} disableRipple>
          <MilitaryTechIcon /> Ranking
        </MenuItemStyled>
        <Divider />
        <MenuItemStyled onClick={withClick(handleDownload, true)} disableRipple disabled={!!downloading}>
          <ListItemIcon>{downloading ? <CircularProgress size={22} /> : <DownloadIcon />}</ListItemIcon>
          <ListItemText primary="Baixar inscrições" secondary="Download no Excel" />
        </MenuItemStyled>
        <Divider />
        <MenuItemStyled onClick={withClick(handleEdit)} disableRipple>
          <EditIcon /> Alterar
        </MenuItemStyled>
        <MenuItemStyled onClick={withClick(handleDelete)} disableRipple disabled>
          <DeleteIcon /> Remover
        </MenuItemStyled>
      </Menu>
    </>
  )
}
