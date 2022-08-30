import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'

export type UserPanelTabs = 'info'
// export type UserPanelTabs = 'info' | 'subscriptions' | 'changePassword'

interface Props {
  value: UserPanelTabs
  onChange: (value: UserPanelTabs) => void
}

export const UserPanelTabs: React.FC<Props> = ({ onChange, value }) => {
  return (
    <TabContext value={value}>
      <TabList onChange={(e, v) => onChange(v)} variant="fullWidth" scrollButtons="auto">
        <Tab label="Informações pessoais" value="info" />
        {/* <Tab label="Alterar senha" value="changePassword" />
        <Tab label="Inscrições" value="subscriptions" /> */}
      </TabList>
    </TabContext>
  )
}
