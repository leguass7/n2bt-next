import React from 'react'

import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
`

const Spin = styled.div`
  width: 44px;
  height: 44px;
  border: 6px solid #f1f1f1;
  border-radius: 50%;
  border-top-color: #000;
  animation: ${rotate} 400ms linear infinite;
`

const Center = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
`

export const StorageLoading: React.FC = () => {
  return (
    <Container>
      <Center>
        <Spin />
        aguarde
      </Center>
    </Container>
  )
}
