import ArrowLeftIcon from '@mui/icons-material/ChevronLeft'
import ArrowRightIcon from '@mui/icons-material/ChevronRight'
import { Button, CardActions, CardContent, Grid } from '@mui/material'

import { LogoSvg } from '~/components/LogoSvg'
import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter } from '~/components/styled'
import { SelectPatner } from '~/components/User/SelectPartner'

import { CardContainer } from './style'

interface Props {}

export const StepPartner: React.FC<Props> = () => {
  const { goTo } = usePassRoll('subscription')

  return (
    <BoxCenter style={{ paddingTop: 12 }}>
      <CardContainer>
        <CardContent>
          <Grid container direction="column" alignItems="center">
            <LogoSvg height={92} />
            <br />
            <SelectPatner />
          </Grid>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button type="button" variant="contained" onClick={() => goTo(1)} startIcon={<ArrowLeftIcon />}>
            Anterior
          </Button>
          <Button type="button" variant="contained" disabled onClick={() => goTo(3)} endIcon={<ArrowRightIcon />}>
            Próximo
          </Button>
        </CardActions>
      </CardContainer>
    </BoxCenter>
  )
}
