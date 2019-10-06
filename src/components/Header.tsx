import React, { FunctionComponent, FunctionComponentElement } from "react"
import styled from "styled-components"

import { ExternalLink, InternalLink } from "./Link"
import { spacingUnit } from "../constants"

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 100%;
  margin: 0 auto;
  padding: ${spacingUnit * 3}px;
`

const Heading1 = styled.h1`
  font-size: ${spacingUnit * 4}px;
  padding: 0.5em 1em;
  a {
    text-decoration: none;
  }
`

const Navigation = styled.nav`
  font-size: ${spacingUnit * 3}px;
`

const NavigationList = styled.ul`
  margin: 1em 0 0.5em;
  text-align: center;
`

const NavigationItem = styled.li`
  display: inline;
  a {
    display: inline-block;
    padding: 0.5em 1.5em;
    text-decoration: none;
  }
`

interface Props {
  siteTitle: string
}

const Component: FunctionComponent<Props> = ({
  siteTitle,
}: Props): FunctionComponentElement<Props> => (
  <header>
    <Container>
      <Heading1>
        <InternalLink to="/">{siteTitle}</InternalLink>
      </Heading1>
      <Navigation>
        <NavigationList>
          <NavigationItem>
            <InternalLink to="/">Home</InternalLink>
          </NavigationItem>
          <NavigationItem>
            <InternalLink to="/about">About</InternalLink>
          </NavigationItem>
          <NavigationItem>
            <ExternalLink href="mailto:hello@chriswilding.co.uk">
              Contact
            </ExternalLink>
          </NavigationItem>
        </NavigationList>
      </Navigation>
    </Container>
  </header>
)

Component.defaultProps = {
  siteTitle: "",
} as Props

export default Component
