import React, { useCallback } from 'react'

import ArrowLeftIcon from '@mui/icons-material/ChevronLeft'
import ArrowRightIcon from '@mui/icons-material/ChevronRight'
import VerifiedIcon from '@mui/icons-material/Verified'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter, Paragraph, Text } from '~/components/styled'
import { DeletePatnerHandler, SelectPatner, SelectPatnerHandler } from '~/components/User/SelectPartner'
import { appBaseURL } from '~/config'
import { CardContainer } from '~/styles'

import { useSubscription } from '../SubscriptionProvider'

interface Props {
  icon: React.ReactNode
}

export const StepPartner: React.FC<Props> = ({ icon }) => {
  const { partner, setPartner, tournamentId, category } = useSubscription()
  const { goTo } = usePassRoll('subscription')

  const handleChange: SelectPatnerHandler = useCallback(
    user => {
      setPartner(user)
    },
    [setPartner]
  )

  const handleNext = useCallback(() => {
    goTo(4)
  }, [goTo])

  const handleDelete: DeletePatnerHandler = useCallback(() => {
    setPartner(null)
  }, [setPartner])

  const renderLink = (text: string) => {
    const link = `${appBaseURL}/subscription?tournamentId=${tournamentId}`
    const site = encodeURI(link)
    return (
      <Button href={`https://wa.me?text=${site}`} target="__blank" size="small" variant="outlined">
        {text}
      </Button>
    )
  }
  return (
    <BoxCenter style={{ paddingTop: 12 }}>
      <CardContainer>
        <CardHeader title={'Escolha da dupla'} subheader={'Faça a escolha de sua dupla antes de prosseguir'} avatar={icon} />
        <Divider />
        <CardContent sx={{ minHeight: 340 }}>
          <Grid container direction="column" alignItems="center">
            <Paragraph>
              Intruções: <br />
              <Text textStyle="italic">
                1. Na busca por sua dupla, dê preferencia à contas verificadas. Você verá um ícone <VerifiedIcon fontSize="small" sx={{}} /> após o
                nome do atleta.
              </Text>
              <br />
              <Text textStyle="italic">
                2. Caso não consiga localizar sua dupla, {renderLink('compartilhe o link')} para cadastro, assim que você confirmar o cadastro da sua
                dupla, continue com sua inscrição.
              </Text>
            </Paragraph>
            <SelectPatner
              defaultPartner={partner}
              onChange={handleChange}
              onDelete={handleDelete}
              tournamentId={tournamentId}
              categoryId={category?.id}
            />
          </Grid>
        </CardContent>
        <Divider />
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button type="button" variant="contained" onClick={() => goTo(2)} startIcon={<ArrowLeftIcon />}>
            Anterior
          </Button>
          <Button type="button" variant="contained" onClick={handleNext} endIcon={<ArrowRightIcon />} disabled={!partner}>
            Próximo
          </Button>
        </CardActions>
      </CardContainer>
    </BoxCenter>
  )
}
