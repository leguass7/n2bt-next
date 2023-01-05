import Image from 'next/image'

// import { RaqueteSvg } from '~/components/svg/RaqueteSvg'

import { FlexContainer } from '../styled'

// import { Container } from './styles';

export const SectionLogo: React.FC = () => {
  return (
    <section>
      <FlexContainer justify="center">
        {/* <RaqueteSvg width={240} /> */}
        <Image width={240} height={240} src="/logo.png" alt="Torneios" />
      </FlexContainer>
    </section>
  )
}
