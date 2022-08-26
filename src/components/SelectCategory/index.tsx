import React, { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import { formatPrice } from '~/helpers'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { ICategory } from '~/server-side/useCases/category/category.dto'
import { listCategories } from '~/services/api/category'

import { BoxCenter, Text } from '../styled'
import { CustomButton } from './styles'

// type Item = ICategory & { selected: boolean }

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

  const handleClick = (id: number) => {
    return () => {
      setSelected(id)
      if (onChange) onChange(id, { ...categories.find(f => f.id === id) })
    }
  }

  return (
    <BoxCenter>
      {categories?.length ? (
        <>
          {categories.map(category => {
            return (
              <CustomButton
                key={`cat-${category.id}`}
                variant={selected === category.id ? 'contained' : 'outlined'}
                onClick={handleClick(category.id)}
              >
                <Text>
                  <Text transform="uppercase" bold>
                    {category.title}
                  </Text>
                  <br />
                  <Text textSize={18}>{formatPrice(category.price)}</Text>
                </Text>
              </CustomButton>
            )
          })}
        </>
      ) : (
        <Text>Nenhuma categoria para esse torneio</Text>
      )}
    </BoxCenter>
  )
}
