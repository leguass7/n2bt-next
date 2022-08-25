import React from 'react'

import { usePassRoll } from '../PassRollLayout'

// import { Container } from './styles';

export const StepCode: React.FC = () => {
  const { customContext } = usePassRoll('signIn')
  return <div>Recuperar senha enviando code={customContext?.code}</div>
}
