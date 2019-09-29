import React, { FunctionComponent } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

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
      <h1>Hi, I&#39;m Chris Wilding</h1>
      <p>I&#39;m a software engineer living and working in Manchester, UK</p>
      <p>
        If you want to find our more about me take a look at my{" "}
        <Link to="/about/">about</Link> page or{" "}
        <a
          href={`https://github.com/${github}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub
        </a>{" "}
        profile. If you want to get in touch contact me through{" "}
        <a
          href={`https://uk.linkedin.com/in/${linkedin}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          LinkedIn
        </a>{" "}
        or by <a href={`mailto:${email}`}>email</a>.
      </p>
      <p>
        I occasionally tweet as{" "}
        <a
          href={`https://twitter.com/${author}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {author}
        </a>
        .
      </p>
    </Layout>
  )
}

export default IndexPage
