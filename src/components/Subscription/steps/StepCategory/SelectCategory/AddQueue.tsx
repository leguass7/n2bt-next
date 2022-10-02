import React from 'react'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
// import Badge from '@mui/material/Badge'
// import Button from '@mui/material/Button'
import { SxProps, darken } from '@mui/material/styles'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { FlexContainer, Paragraph, Text } from '~/components/styled'
import { categoryGenders } from '~/config/constants'
import { formatPrice } from '~/helpers'
import type { ICategory } from '~/server-side/useCases/category/category.dto'

type Props = Partial<ICategory> & { value: number }

export const AddQueue: React.FC<Props> = ({ title, gender, value }) => {
  const { theme } = useAppTheme()
  const sxProps: SxProps = {
    bgcolor: darken(theme.colors.background, 0.3),
    border: `1px solid ${darken(theme.colors.background, 0.4)}`
  }
  const genderLabel = categoryGenders.find(f => f.id === gender)?.label || '--'
  return (
    <Accordion expanded={true} sx={{ width: '100%', ...sxProps }}>
      <AccordionSummary sx={{ pt: 1, pb: 0, mb: 0 }}>
        <FlexContainer justify="flex-start" gap={8}>
          <Text style={{ filter: 'grayscale(100%)', flex: 1 }}>
            <Text transform="uppercase" textSize={18}>
              {title}
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
              <br />{' '}
            </Text>
          </Text>
        </FlexContainer>
      </AccordionSummary>
      <AccordionDetails>
        <Paragraph align="center">
          Vagas esgotadas para categoria.
          {/* <br />
          <br />
          <Badge badgeContent="Em breve" variant="standard" color="info">
            <Button variant="outlined" color="secondary" disabled>
              Entrar na fila de espera
            </Button>
          </Badge> */}
        </Paragraph>
      </AccordionDetails>
    </Accordion>
  )
}
