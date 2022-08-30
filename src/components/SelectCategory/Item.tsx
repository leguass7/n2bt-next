import React from 'react'
import ReactMarkdown from 'react-markdown'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Radio from '@mui/material/Radio'
import gfm from 'remark-gfm'

import { formatPrice } from '~/helpers'
import type { ICategory } from '~/server-side/useCases/category/category.dto'

import { FlexContainer, MkContainer, Text } from '../styled'

type Params = {
  price: number
  active?: boolean
  disabled?: boolean
}
export type ItemClickHandler = (id: number, params: Params) => any
type Props = Partial<ICategory> & {
  paidCount?: number
  actived?: boolean
  onClick?: ItemClickHandler
}
export const Item: React.FC<Props> = ({
  actived,
  onClick,
  id,
  title,
  description,
  price,
  discount = 1,
  paidCount = 0,
  subscriptions = [],
  tournament
}) => {
  // const hasSub = subscriptions?.length ?? 0
  const paid = subscriptions?.filter(f => !!f.paid)?.length
  const maxSubscription = tournament?.maxSubscription || 0
  const disabled = !!(paid || (paidCount > 0 && paidCount >= maxSubscription))

  let value = price
  if (paidCount && discount && !paid) {
    value = Math.ceil(discount * price)
  }

  const handleExpand = (_event: React.SyntheticEvent, _active: boolean) => {
    if (onClick) onClick(id, { price, disabled })
  }

  const renderSecondary = () => {
    if (paid) return <Text transform="uppercase">Pago</Text>
    return <Text textSize={12}>Quem pode participar?</Text>
  }

  return (
    <Accordion expanded={!!actived} onChange={handleExpand} sx={{ width: '100%' }}>
      <AccordionSummary>
        <FlexContainer justify="flex-start" gap={10}>
          <Radio checked={!!actived} disabled={!!disabled} />
          <Text style={{ filter: 'grayscale(100%)' }}>
            <Text transform="uppercase" textSize={18}>
              {title}
            </Text>
          </Text>
          <Text>{formatPrice(value)}</Text>
          <Text style={{ flex: 1 }} />
          <Text>{renderSecondary()}</Text>
        </FlexContainer>
      </AccordionSummary>
      <AccordionDetails>
        <MkContainer>
          <ReactMarkdown remarkPlugins={[gfm]}>{description}</ReactMarkdown>
        </MkContainer>
      </AccordionDetails>
    </Accordion>
  )
}
