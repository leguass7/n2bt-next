import React, { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { Alert, AlertTitle } from '@mui/material'
import Badge from '@mui/material/Badge'

import { BoxCenter, FlexContainer, Text } from '~/components/styled'
import { formatPrice } from '~/helpers'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { ICategory } from '~/server-side/useCases/category/category.dto'
import { listCategories } from '~/services/api/category'

import { CustomButton } from './styles'

export type CategoryChangeHandler = (categoryId?: number, category?: ICategory) => any
type Props = {
  tournamentId: number
  onChange?: CategoryChangeHandler
  defaultSelected?: number
}
export const SelectCategory: React.FC<Props> = ({ tournamentId, onChange, defaultSelected = 0 }) => {
  const [selected, setSelected] = useState(defaultSelected)
  const [categories, setCategories] = useState<ICategory[]>([])

  const fetchData = useCallback(async () => {
    if (tournamentId) {
      const response = await listCategories(tournamentId)
      if (response?.success && response?.categories?.length) {
        setCategories(response.categories)
      } else {
        toast.error('Nenhuma categoria para torneio')
      }
    }
  }, [tournamentId])

  useOnceCall(fetchData)

  const handleClick = (id: number, sel?: boolean) => {
    return () => {
      if (!sel) {
        setSelected(id)
        if (onChange) onChange(id, { ...categories.find(f => f.id === id) })
      }
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

  console.log('paidCount', paidCount)

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

      <BoxCenter>
        {categories?.length ? (
          <>
            {categories.map(category => {
              const hasSub = category?.subscriptions?.length ?? 0
              const paid = category?.subscriptions?.filter(f => !!f.paid)?.length
              const active = !!(selected === category.id)
              return (
                <div key={`cat-${category.id}`} style={{ marginBottom: 16 }}>
                  <Badge
                    color={paid ? 'success' : 'warning'}
                    variant="dot"
                    invisible={!hasSub}
                    componentsProps={{ badge: { style: { width: 10, height: 10 } } }}
                  >
                    <CustomButton variant={active ? 'contained' : 'outlined'} onClick={handleClick(category.id, active)} disabled={!!paid}>
                      <Text>
                        <Text transform="uppercase" bold>
                          {category.title}
                        </Text>
                        <br />
                        <Text textSize={18}>{formatPrice(category.price)}</Text>
                      </Text>
                    </CustomButton>
                  </Badge>
                </div>
              )
            })}
          </>
        ) : (
          <Text>Nenhuma categoria para esse torneio</Text>
        )}
      </BoxCenter>
    </>
  )
}
