import Tab from '@mui/material/Tab'
import Tabs, { type TabsProps } from '@mui/material/Tabs'

import { Text } from '../styled'

export interface ITab {
  label: string
  value: number
}

interface Props extends Omit<TabsProps, 'onChange'> {
  tabs: ITab[]
  onChange: (value: number) => void
}

export const SimpleTab: React.FC<Props> = ({ onChange, tabs, value }) => {
  if (!tabs?.length) return null

  const renderLabel = (title = '') => {
    return (
      <Text>
        {title.split(' ').map((s, i) => (
          <Text key={`${s}${i}`} transform="uppercase">
            {s}
            <br />
          </Text>
        ))}
      </Text>
    )
  }
  return (
    <Tabs value={value} onChange={(e, v) => onChange?.(v)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
      {tabs.map(({ label, value }, index) => {
        return <Tab label={renderLabel(label)} value={value} key={`tab-${index}`} wrapped />
      })}
    </Tabs>
  )
}
