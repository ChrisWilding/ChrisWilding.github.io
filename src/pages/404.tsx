import React, { FunctionComponent } from "react"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { InternalLink } from "../components/Link"

const NotFoundPage: FunctionComponent = () => (
  <Layout>
    <SEO title="Not found" />
    <h2>Not Found</h2>
    <p>
      Something went wrong. Try going back to the{" "}
      <InternalLink to="/">home</InternalLink> page.
    </p>
  </Layout>
)

export default NotFoundPage
