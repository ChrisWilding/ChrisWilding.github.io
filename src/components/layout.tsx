import React, {
  FunctionComponent,
  FunctionComponentElement,
  PropsWithChildren,
} from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

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
      <Header siteTitle={data.site.siteMetadata.title || ""} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0px 1.0875rem 1.45rem`,
          paddingTop: 0,
        }}
      >
        <main>{children}</main>
      </div>
    </>
  )
}

export default Layout
