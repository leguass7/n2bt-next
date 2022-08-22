import React from 'react'

import { LogoSvg } from '../LogoSvg'
import { FlexContainer } from '../styled'

// import { Container } from './styles';

export const SectionLogo: React.FC = () => {
  return (
    <section>
      <FlexContainer justify="center">
        <LogoSvg width={320} />
      </FlexContainer>
    </section>
  )
}
