import React, {
  FunctionComponent,
  FunctionComponentElement,
  PropsWithChildren,
} from "react"
import styled from "styled-components"
import { useStaticQuery, graphql } from "gatsby"

import GlobalStyle from "../styles/GlobalStyle"
import Header from "./Header"

const Main = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 0px 1.0875rem 1.45rem;
  padding-top: 0;
`

const Layout: FunctionComponent<PropsWithChildren<{}>> = ({
  children,
}: PropsWithChildren<{}>): FunctionComponentElement<{}> => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <GlobalStyle />
      <Header siteTitle={data.site.siteMetadata.title || ""} />
      <Main>
        <main>{children}</main>
      </Main>
    </>
  )
}

export default Layout
