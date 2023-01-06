// import { RaqueteSvg } from '~/components/svg/RaqueteSvg'

import { useAppTheme } from '../AppThemeProvider/useAppTheme'
import { FlexContainer } from '../styled'
import { LogoCEAVertical } from '../svg/LogoCEAVertical'

export const SectionLogo: React.FC = () => {
  const { theme } = useAppTheme()

  return (
    <section>
      <FlexContainer justify="center">
        {/* <RaqueteSvg width={240} /> */}
        <LogoCEAVertical width={240} white={theme.colors.background} />
        {/* <Image width={240} height={240} src="/logo.png" alt="Torneios" /> */}
      </FlexContainer>
    </section>
  )
}
