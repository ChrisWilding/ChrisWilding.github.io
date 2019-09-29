import React, { FunctionComponent } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage: FunctionComponent = () => (
  <Layout>
    <SEO title="Not found" />
    <h1>Not Found</h1>
    <p>
      Something went wrong. Try going back to the <Link to="/">home</Link> page.
    </p>
  </Layout>
)

export default NotFoundPage
