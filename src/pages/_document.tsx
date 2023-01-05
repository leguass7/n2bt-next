import Document, { Head, Html, Main, NextScript, DocumentContext } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

import { siteName } from '~/config/constants'

//@ts-ignore
export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="pt-br">
        <Head>
          <meta charSet="utf-8" />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="pt_BR" />
          {/* <meta property="og:title" content="N2BT - Beach Tennis" /> */}
          <meta property="og:title" content="{siteName}" />
          <meta property="og:description" content="Beach Tennis, Aulas, Torneios e muito mais. Cadastre-se" />
          <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais. Cadastre-se" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="512" />
          <meta property="og:image:height" content="512" />
          {/* <meta property="og:image" content="https://n2bt.avatarsolucoesdigitais.com.br/face.png" /> */}
          <meta property="og:image" content="https://cea.avatarsolucoesdigitais.com.br/face.png" />
          {/* <meta property="og:site_name" content="N2BT - Beach Tennis" /> */}
          <meta property="og:site_name" content={siteName} />
        </Head>
        <body id="body">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
