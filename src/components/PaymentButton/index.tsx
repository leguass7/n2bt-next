import React from 'react'

import Button, { type ButtonProps } from '@mui/material/Button'

import imgEfi from '~/assets/efi-by-gn-512x512.svg'
import imgPix from '~/assets/pix-106.svg'
import type { PaymentType } from '~/services/api/payment'

type PaymentButtonProps = {
  children?: React.ReactNode
  type: PaymentType
  onClick?: ButtonProps['onClick']
}
export const PaymentButton: React.FC<PaymentButtonProps> = props => {
  const { type, children, ...rest } = props
  const src = type === 'PIX' ? imgPix?.src : imgEfi?.src
  const title = type === 'PIX' ? 'FAZ UM PIX' : 'LINK DE PAGAMENTO'
  return (
    <Button startIcon={<img src={src} alt={type} height={38} />} variant="outlined" sx={{ backgroundColor: '#ffffff' }} {...rest}>
      {children || title}
    </Button>
  )
}
