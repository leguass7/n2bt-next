import React, { useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'

import { FormRecoverCode, FormRecoverCodeProps } from '~/components/forms/UnForm/FormRecoverCode'
import { LogoSvg } from '~/components/LogoSvg'
import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter, FlexContainer, Text } from '~/components/styled'

import { FromPass } from '../forms/UnForm/FromPass'
import type { CustomContextSigin } from './custom.types'

export const StepCode: React.FC = () => {
  const [success, setSuccess] = useState(false)
  const { goTo, setCustomContext, customContext } = usePassRoll<CustomContextSigin>('signIn')

  const handleCancel = () => {
    setCustomContext(null)
    goTo(1)
  }

  const handleCodeSuccess: FormRecoverCodeProps['onSuccess'] = data => {
    setCustomContext({ ...data })
  }

  const handleResetSuccess = () => {
    setSuccess(true)
    toast.success('Senha alterada com sucesso')
  }

  const handleInvalid = (data: Record<string, any>) => {
    if (data) Object.entries(data).forEach(([, v]) => v && toast.error(v))
  }

  return (
    <BoxCenter>
      <FlexContainer justify="center">{/* <LogoSteps layoutName={layoutName} /> */}</FlexContainer>
      <FlexContainer justify="center">
        <Card>
          <CardContent>
            <FlexContainer justify="center">
              <LogoSvg height={92} />
            </FlexContainer>
            <Divider sx={{ mt: 2, mb: 1 }} />
            {success ? (
              <>
                <FlexContainer justify="center" verticalPad={16} style={{ maxWidth: 320 }}>
                  <Text bold textSize={18} align="center">
                    Sua senha foi recuperada com sucesso
                    <br />
                    <Text>Agora você já pode realizar o login</Text>
                  </Text>
                </FlexContainer>
                <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
                  <Button color="primary" variant="contained" type="button" onClick={handleCancel}>
                    {'Fazer Login'}
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                {customContext?.authorization ? (
                  <FromPass
                    onCancel={handleCancel}
                    onSuccess={handleResetSuccess}
                    onInvalid={handleInvalid}
                    authorization={{ authorization: customContext?.authorization, userId: customContext?.userId }}
                  />
                ) : (
                  <FormRecoverCode
                    onCancel={handleCancel}
                    onSuccess={handleCodeSuccess}
                    onInvalid={handleInvalid}
                    privateCode={customContext?.privateCode}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </FlexContainer>
    </BoxCenter>
  )
}
