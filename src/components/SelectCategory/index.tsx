import React, { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Badge from '@mui/material/Badge'

import { BoxCenter, FlexContainer, Text } from '~/components/styled'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { ICategory } from '~/server-side/useCases/category/category.dto'
import { listCategoriesSub } from '~/services/api/category'

import { CircleLoading } from '../CircleLoading'
import { Item, ItemClickHandler } from './Item'

export type CategoryChangeHandler = (categoryId?: number, category?: ICategory) => any
type Props = {
  tournamentId: number
  maxSubscription: number
  onChange?: CategoryChangeHandler
  defaultSelected?: number
}
export const SelectCategory: React.FC<Props> = ({ tournamentId, onChange, defaultSelected = 0, maxSubscription }) => {
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(defaultSelected)
  const [categories, setCategories] = useState<ICategory[]>([])

  const fetchData = useCallback(async () => {
    if (tournamentId) {
      setLoading(true)
      const response = await listCategoriesSub(tournamentId)
      if (response?.success && response?.categories?.length) {
        setCategories(response.categories)
      } else {
        toast.error('Nenhuma categoria para torneio')
      }
      setLoading(false)
    }
  }, [tournamentId])

  useOnceCall(fetchData)

  const handleClick: ItemClickHandler = (id: number, { active, price, disabled }) => {
    if (!active && !disabled) {
      setSelected(id)
      if (onChange) onChange(id, { ...categories.find(f => f.id === id), price })
    }
  }

  const [paidCount, hasSubs] = useMemo(() => {
    const hasSubsIn = categories.find(c => !!c?.subscriptions?.length)
    const count =
      hasSubsIn &&
      categories.reduce((acc, c) => {
        const paids = c?.subscriptions?.filter(s => !!s.paid)?.length || 0
        acc = acc + paids
        return acc
      }, 0)
    return [count, hasSubsIn]
  }, [categories])

  return (
    <>
      {hasSubs && !paidCount ? (
        <FlexContainer verticalPad={10} justify="center">
          <Alert severity="info" sx={{ width: '100%' }}>
            <AlertTitle>Desconto</AlertTitle>
            Pague o PIX da primeira inscrição para obter desconto na segunda.
          </Alert>
        </FlexContainer>
      ) : null}
      {maxSubscription && paidCount >= maxSubscription ? (
        <FlexContainer verticalPad={10} justify="center">
          <Alert severity="warning" sx={{ width: '100%' }}>
            <AlertTitle>Limite de inscrições</AlertTitle>
            Você já realizou o máximo de <strong>{maxSubscription}</strong> inscrições.
          </Alert>
        </FlexContainer>
      ) : null}

      <BoxCenter>
        {categories?.length ? (
          <>
            {categories.map(category => {
              const hasSub = category?.subscriptions?.length ?? 0
              const paid = category?.subscriptions?.filter(f => !!f.paid)?.length
              const actived = !!(selected === category.id)

              return (
                <div key={`cat-${category.id}`} style={{ marginBottom: 16, width: '100%' }}>
                  <Badge
                    color={paid ? 'success' : 'warning'}
                    variant="dot"
                    invisible={!hasSub}
                    componentsProps={{ badge: { style: { width: 10, height: 10 } } }}
                    sx={{ width: '100%' }}
                  >
                    <Item {...category} onClick={handleClick} actived={!!actived} paidCount={paidCount} />
                  </Badge>
                </div>
              )
            })}
          </>
        ) : (
          <Text>Nenhuma categoria para esse torneio</Text>
        )}
        {loading ? <CircleLoading /> : null}
      </BoxCenter>
    </>
  )
}
