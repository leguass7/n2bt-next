import React from 'react'
import ReactMarkdown from 'react-markdown'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Radio from '@mui/material/Radio'
import gfm from 'remark-gfm'

import { categoryGenders } from '~/config/constants'
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
  tournament,
  gender
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

  const genderLabel = categoryGenders.find(f => f.id === gender)?.label || '--'

  return (
    <Accordion expanded={!!actived} onChange={handleExpand} sx={{ width: '100%' }}>
      <AccordionSummary>
        <FlexContainer justify="flex-start" gap={10}>
          <Radio checked={!!actived} disabled={!!disabled} />

          <Text style={{ filter: 'grayscale(100%)', flex: 1 }}>
            <Text transform="uppercase" textSize={18}>
              {title}
            </Text>
            <Text>
              <br />
              {genderLabel}
            </Text>
          </Text>

          <FlexContainer justify="flex-end" gap={10}>
            <Text>{formatPrice(value)}</Text>
            <Text>{renderSecondary()}</Text>
          </FlexContainer>
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
