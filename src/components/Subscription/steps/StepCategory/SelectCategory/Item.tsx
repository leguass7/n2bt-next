import React, { useCallback, useState, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import Radio from '@mui/material/Radio'
import type { SxProps } from '@mui/material/styles'
import gfm from 'remark-gfm'

import { Partner } from '~/components//User/SelectPartner/Partner'
import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { usePassRoll } from '~/components/PassRollLayout'
import { FlexContainer, MkContainer, Paragraph, Text } from '~/components/styled'
import { useSubscription } from '~/components/Subscription/SubscriptionProvider'
import { useUserAuth } from '~/components/UserProvider'
import { categoryGenders } from '~/config/constants'
import { formatPrice } from '~/helpers'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { ICategory } from '~/server-side/useCases/category/category.dto'
import type { IUser } from '~/server-side/useCases/user/user.dto'
import { findOneUser } from '~/services/api/user'

import { AddQueue } from './AddQueue'

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

export const Item: React.FC<Props> = ({ onClick, actived, paidCount = 0, ...category }) => {
  const { id, title, description, price, discount = 1, subscriptions = [], tournament, gender, limit } = category
  const { theme } = useAppTheme()
  const { userData } = useUserAuth()
  const [catPartner, setCatPartner] = useState<IUser>(null)
  const { setPartner } = useSubscription()
  const { goTo } = usePassRoll('subscription')

  const fetchPartner = useCallback(async () => {
    const partnerSubscription = subscriptions?.find(f => f.partnerId === userData?.id)
    if (partnerSubscription) {
      const response = await findOneUser({ id: partnerSubscription?.userId })
      if (response?.success && response?.user) {
        setCatPartner(response.user)
      }
    }
  }, [subscriptions, userData])

  const mySubs = subscriptions?.filter(f => f.userId === userData?.id)
  const paid = mySubs?.filter(f => !!f.paid)?.length
  const maxSubscription = tournament?.maxSubscription || 0
  const disabled = !!(paid || (paidCount > 0 && paidCount >= maxSubscription))

  const genderLabel = categoryGenders.find(f => f.id === gender)?.label || '--'

  let value = price
  if (paidCount && discount && !paid) {
    value = Math.ceil(discount * price)
  }

  const handleExpand = (_event: React.SyntheticEvent, _active: boolean) => {
    if (onClick) onClick(id, { price: value, disabled })
  }

  const handlePartnerConfirm = () => {
    if (catPartner) {
      setPartner({ ...catPartner })
      goTo(4)
    }
  }

  const handlePartnerDelete = () => {
    setPartner(null)
  }

  const renderSecondary = () => {
    if (paid) return <Text transform="uppercase">Pago</Text>
    return <Text textSize={12}>Quem pode participar?</Text>
  }

  useOnceCall(fetchPartner)

  const isLimited = useMemo(() => {
    return !!(subscriptions?.length >= limit && !catPartner)
  }, [subscriptions, limit, catPartner])

  // const isLimited = subscriptions?.length // para testar fila

  const sxProps: SxProps = catPartner ? { border: `1px solid ${theme.colors.contrast}` } : {}

  if (isLimited) return <AddQueue {...category} value={value} />

  return (
    <Accordion expanded={!!actived} onChange={handleExpand} sx={{ width: '100%', ...sxProps }} disabled={!!isLimited}>
      <AccordionSummary sx={{ pt: 1, pb: 0, mb: 0 }}>
        <FlexContainer justify="flex-start" gap={8}>
          <Radio checked={!!actived} disabled={!!disabled} />
          <Text style={{ filter: 'grayscale(100%)', flex: 1 }}>
            <Text transform="uppercase" textSize={18}>
              {title} {limit}
            </Text>
            <Text>
              <br />
              {genderLabel}
            </Text>
          </Text>
          <Text align="right">
            <Text transform="uppercase" textSize={18} align="right">
              {formatPrice(value)}
            </Text>
            <Text>
              <br />
              {renderSecondary()}
            </Text>
          </Text>
        </FlexContainer>
      </AccordionSummary>
      <AccordionDetails>
        {!!actived ? <Divider sx={{ mb: 1, mt: 0 }} /> : null}
        <MkContainer>
          <ReactMarkdown remarkPlugins={[gfm]}>{description}</ReactMarkdown>
        </MkContainer>
        {catPartner ? (
          <>
            <Divider sx={{ mt: 1, mb: 1 }}>Parceiro</Divider>
            <Paragraph>Alguém já escolheu você nessa categoria. Por favor avance para realizar a sua inscrição, ou exclua essa parceria.</Paragraph>
            <div style={{ minWidth: 260, width: '100%' }}>
              <List>
                <Partner {...catPartner} onConfirm={handlePartnerConfirm} onDelete={handlePartnerDelete} divider />
              </List>
            </div>
          </>
        ) : null}
      </AccordionDetails>
    </Accordion>
  )
}
