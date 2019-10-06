import styled from "styled-components"
import { Link } from "gatsby"

const styles = `
  color: white;
`

export const ExternalLink = styled.a`
  ${styles}
`

export const InternalLink = styled(Link)`
  ${styles}
`
