import { memo } from 'react'

import { createGlobalStyle, css } from 'styled-components'

import bg from '~/assets/summer-bg.png'
import groundImg from '~/assets/summer-ground.png'
import { brighten } from '~/helpers/colors'

const globBackground = css`
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: cover;
  background-attachment: scroll;
  background-image: url(${bg.src});
  &::before {
    content: '';
    display: inline-block;
    width: 100%;
    height: 375px;
    /* border: 1px dashed #f00; */
    position: absolute;
    bottom: 0;
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: contain;
    background-image: url(${groundImg.src});
  }
`

const globCss = css`
  h2 {
    font-size: 20px;
  }
  a,
  a:visited,
  a:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`

const GlobalStyle = createGlobalStyle`
  * {
     box-sizing: border-box;
     margin: 0;
     padding: 0;
  }

  html {
    height: 100%;
    margin: 0 auto;
    padding: 0;
  }

  body {
    position: relative;
    margin: 0 auto;
    padding: 0;
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: cover;
    background-attachment: scroll;
    min-height: 100vh;
    height: 100%;
    max-height: auto;
    box-sizing: border-box;
    /* background-color: ${({ theme }) => brighten(theme.colors.background, 1.1)}; */
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: Gilroy, Tahoma, Geneva, Verdana, sans-serif;
    border: 0;
    max-width: 100%;
    width: 100%;
    ${globBackground}

  }

  #__next{
    position: relative;
    min-height: 100%;
    max-height: auto;
    height: 100%;
    max-width: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
    border: 0;
    ${globCss}

  }

  @page {
    size: A4;
  }
`

export default memo(GlobalStyle)
