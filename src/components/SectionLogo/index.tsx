import React from 'react'

import { RaqueteSvg } from '~/components/svg/RaqueteSvg'

import { FlexContainer } from '../styled'

// import { Container } from './styles';

export const SectionLogo: React.FC = () => {
  return (
    <section>
      <FlexContainer justify="center">
        <RaqueteSvg width={240} />
      </FlexContainer>
    </section>
  )
}
