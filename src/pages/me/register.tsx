import { useState } from 'react'

import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { Layout } from '~/components/app/Layout'
import { FormRegister } from '~/components/forms/UnForm/FormRegister'
import { BoxCenter, FlexContainer, H4 } from '~/components/styled'
import { UserPanelTabs } from '~/components/User/UserPanel/UserPanelTabs'
import { useAppAuth } from '~/hooks/useAppAuth'
import { CardContainer } from '~/styles'

interface PageProps {
  csrfToken?: string
  uaString?: string
}

const MeRegisterPage: NextPage<PageProps> = ({}) => {
  const { userData } = useAppAuth()
  const [tab, setTab] = useState<UserPanelTabs>('info')

  return (
    <Layout>
      <Head>
        <title>Cadastro - N2BT Beach Tennis</title>
        <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais" />
      </Head>

      <BoxCenter>
        <FlexContainer justify="center" align="center" verticalPad={10}>
          <H4 textSize={24}>Bem-vindo {userData?.name ?? null}</H4>
        </FlexContainer>
        <CardContainer>
          <UserPanelTabs value={tab} onChange={setTab} />
          <CardContent>{tab === 'info' ? <FormRegister /> : null}</CardContent>
        </CardContainer>
      </BoxCenter>

      <Typography variant="body1" align="center" sx={{ m: 2 }}>
        <Link href={'/'}>VOLTAR</Link>
      </Typography>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req }) => {
  return {
    props: {
      uaString: req.headers['user-agent']
    }
  }
}

export default MeRegisterPage
