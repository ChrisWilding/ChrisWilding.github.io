import React, { FunctionComponent } from "react"
import { useStaticQuery, graphql } from "gatsby"

import Heading from "../components/Heading"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { ExternalLink, InternalLink } from "../components/Link"

const IndexPage: FunctionComponent = () => {
  const {
    site: {
      siteMetadata: { author, email, github, linkedin },
    },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            author
            email
            github
            linkedin
          }
        }
      }
    `
  )

  return (
    <Layout>
      <SEO title="Home" />
      <Heading>Hi, I&#39;m Chris Wilding</Heading>
      <p>I&#39;m a software engineer living and working in Manchester, UK</p>
      <p>
        If you want to find our more about me take a look at my{" "}
        <InternalLink to="/about/">about</InternalLink> page or{" "}
        <ExternalLink
          href={`https://github.com/${github}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub
        </ExternalLink>{" "}
        profile. If you want to get in touch contact me through{" "}
        <ExternalLink
          href={`https://uk.linkedin.com/in/${linkedin}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          LinkedIn
        </ExternalLink>{" "}
        or by <ExternalLink href={`mailto:${email}`}>email</ExternalLink>.
      </p>
      <p>
        I occasionally tweet as{" "}
        <ExternalLink
          href={`https://twitter.com/${author}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {author}
        </ExternalLink>
        .
      </p>
    </Layout>
  )
}

export default IndexPage
