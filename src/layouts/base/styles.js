import { Layout } from 'antd'
import styled from 'styled-components'

const { Content, Footer } = Layout

export const BaseLogo = styled.div`
  height: 42px;
  margin: 25px 0px;
  text-align: center;
`

export const BaseLogoImg = styled.img`
  height: 100%;
`

export const BaseFooter = styled(Footer)`
  text-align: center;
  background-color: #f4f7fd;
`

export const BaseLayout = styled(Layout)`
  min-height: 100vh;
`

export const BaseContent = styled(Layout)`
  background-color: #f4f7fd;
`

export const BaseBody = styled(Content)`
  margin: 30px 40px;
`
