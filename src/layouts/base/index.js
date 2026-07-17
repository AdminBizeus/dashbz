import Link from 'next/link'
import { useState } from 'react'
import { Layout, Menu, Icon } from 'antd'
import { NavBar } from '../../containers'
import moment from 'moment'

import {
  BaseLogo,
  BaseLogoImg,
  BaseLayout,
  BaseContent,
  BaseBody,
  BaseFooter
} from './styles'

moment.locale('es')

const { Sider } = Layout

export const Base = ({ current, children }) => {
  const [collapsed, onCollapse] = useState(false)
  return (
    <BaseLayout>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => onCollapse(!collapsed)}
        style={{ background: '#1a1a2e' }}
      >
        <BaseLogo>
          <BaseLogoImg src='/static/img/bizeus.png' />
        </BaseLogo>
        <Menu
          theme='dark'
          selectedKeys={[current]}
          mode='inline'
          style={{ background: '#1a1a2e' }}
        >
          <Menu.Item key='home'>
            <Link href='/'>
              <a>
                <Icon type='home' />
                <span>Inicio</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key='users'>
            <Link href='/users'>
              <a>
                <Icon type='user' />
                <span>Usuarios</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key='connections'>
            <Link href='/connections'>
              <a>
                <Icon type='api' />
                <span>Conexiones</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key='companies'>
            <Link href='/companies'>
              <a>
                <Icon type='bank' />
                <span>Compañías</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key='subscriptions'>
            <Link href='/subscriptions'>
              <a>
                <Icon type='credit-card' />
                <span>Suscripciones</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key='support'>
            <Link href='/support'>
              <a>
                <Icon type='message' />
                <span>Soporte</span>
              </a>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <BaseContent>
        <NavBar />
        <BaseBody>{children}</BaseBody>
        <BaseFooter>Bizeus © 2024</BaseFooter>
      </BaseContent>
    </BaseLayout>
  )
}
