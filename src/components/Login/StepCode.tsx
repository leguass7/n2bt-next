import React, { useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'

import { FormRecoverCode, FormRecoverCodeProps } from '~/components/forms/UnForm/FormRecoverCode'
import { FromPass } from '~/components/forms/UnForm/FromPass'
import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter, FlexContainer, Text } from '~/components/styled'
import { LogoSvg } from '~/components/svg/LogoSvg'
import { useAppRecoverCode } from '~/hooks/useAppAuth'

import type { CustomContextSigin } from './custom.types'

export const StepCode: React.FC = () => {
  const [, setRecoverCode] = useAppRecoverCode()
  const [success, setSuccess] = useState(false)
  const { goTo, setCustomContext, customContext } = usePassRoll<CustomContextSigin>('signIn')

  const handleCancel = () => {
    setRecoverCode(null)
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
      <Card>
        <FlexContainer justify="center" verticalPad={8}>
          <LogoSvg height={72} />
        </FlexContainer>
        <Divider />
        <CardContent>
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
    </BoxCenter>
  )
}
