import { createContext } from 'use-context-selector'

export interface ISubscriptionProviderContext {}
const SubscriptionProviderContext = createContext({} as ISubscriptionProviderContext)

type Props = {
  children?: React.ReactNode
  tournamentId: number
}
export const SubscriptionProvider: React.FC<Props> = ({ children }) => {
  return <SubscriptionProviderContext.Provider value={{}}>{children}</SubscriptionProviderContext.Provider>
}
