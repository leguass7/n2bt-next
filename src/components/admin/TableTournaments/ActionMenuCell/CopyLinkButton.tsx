import React, { useState } from 'react'

import LinkIcon from '@mui/icons-material/Link'
import { IconButton, Tooltip } from '@mui/material'
import copy from 'copy-to-clipboard'

type CopyLinkButtonProps = {
  link?: string
}
export const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ link }) => {
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    setCopied(true)
    copy(link)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Tooltip title={copied ? 'Copiado' : 'Copiar'} arrow>
      <IconButton onClick={handleClick} color="info" size="small" disabled={!link}>
        <LinkIcon />
      </IconButton>
    </Tooltip>
  )
}
