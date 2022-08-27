import styled from 'styled-components'

export const LayoutContainer = styled.div`
  display: block;
  width: 100%;
  max-width: 100% !important;
  margin: 0;
  padding: ${({ theme }) => theme.spacing.l}px;
  padding-top: 72px;
  overflow-x: hidden;
  border: 1px dashed #f00;
`
