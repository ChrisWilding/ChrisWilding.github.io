import { Link } from "gatsby"
import React, { FunctionComponent, FunctionComponentElement } from "react"

interface Props {
  siteTitle: string
}

const Header: FunctionComponent<Props> = ({
  siteTitle,
}: Props): FunctionComponentElement<Props> => (
  <header>
    <div>
      <h1 style={{ margin: 0 }}>
        <Link to="/" >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </header>
)

Header.defaultProps = {
  siteTitle: "",
} as Props

export default Header
