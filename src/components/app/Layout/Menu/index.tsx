import React from 'react'

import Drawer from '@mui/material/Drawer'

import { isDefined } from '~/helpers/validation'

import { useMenu } from '../LayoutProvider'

// import { Container } from './styles';

export const Menu: React.FC = () => {
  const [open, setOpen] = useMenu()

  const toogleMenu = (o?: boolean) => {
    if (isDefined(o)) setOpen(!!o)
    else setOpen(old => !old)
  }

  return (
    <Drawer open={open} onClose={() => toogleMenu(false)}>
      Menu
    </Drawer>
  )
}
