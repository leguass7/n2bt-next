import styled from 'styled-components'

export const LayoutContainer = styled.div`
  display: block;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.l}px;
  padding-top: 72px;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
`
