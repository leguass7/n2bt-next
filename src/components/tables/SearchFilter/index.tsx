import React, { useCallback, useState } from 'react'

import styled from 'styled-components'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { SearchBar } from '~/components/SearchBar'
import { FlexContainer } from '~/components/styled'

const SearchContainer = styled.div`
  display: block;
`
type IFilterData = { search?: string } & Record<string, any>

export type SearchFilterProps = {
  spacing?: number
  hideText?: boolean
  children?: React.ReactNode
  onFilterChange?: (filter: IFilterData) => void
}
export const SearchFilter: React.FC<SearchFilterProps> = ({ hideText, children, onFilterChange, spacing = 0 }) => {
  const { theme } = useAppTheme()
  const [localFilter, setLocalFilter] = useState<IFilterData>({})

  const handleSearchText = useCallback(
    (search?: string) => {
      const newFilter = { ...localFilter, search }
      setLocalFilter(newFilter)
      if (onFilterChange) onFilterChange(newFilter)
    },
    [localFilter, onFilterChange]
  )

  return (
    <FlexContainer horizontalPad={theme.spacing.xl * spacing}>
      <SearchContainer>{!hideText ? <SearchBar onChangeText={handleSearchText} /> : null}</SearchContainer>
      <div>{children}</div>
    </FlexContainer>
  )
}
