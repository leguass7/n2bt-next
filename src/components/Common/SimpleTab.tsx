import Tab from '@mui/material/Tab'
import Tabs, { TabsProps } from '@mui/material/Tabs'

export interface ITab {
  label: string
  value: string
}

interface Props extends Omit<TabsProps, 'onChange'> {
  tabs: ITab[]
  onChange: (value: string) => void
}

export const SimpleTab: React.FC<Props> = ({ onChange, tabs, value = false, ...props }) => {
  if (!tabs?.length) return null

  return (
    <Tabs value={value} {...props} onChange={(e, v) => onChange?.(v)}>
      {tabs.map(({ label, value }, index) => {
        return <Tab label={label} value={value} key={`tab-${index}`} />
      })}
    </Tabs>
  )
}
