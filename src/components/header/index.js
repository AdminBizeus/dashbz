import { Layout, Avatar, Dropdown, Menu, Icon } from 'antd'
import styled from 'styled-components'

const { Header: AntHeader } = Layout

const StyledHeader = styled(AntHeader)`
  background: #fff;
  padding: 0 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 12px;
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
`

const UserName = styled.span`
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.65);
`

export const Header = ({ handleLogout, user }) => {
  const menu = (
    <Menu>
      <Menu.Item key='profile'>
        <Icon type='user' />
        <span style={{ marginLeft: 8 }}>Perfil</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='logout' onClick={handleLogout}>
        <Icon type='logout' />
        <span style={{ marginLeft: 8 }}>Cerrar sesión</span>
      </Menu.Item>
    </Menu>
  )

  return (
    <StyledHeader>
      <Dropdown overlay={menu} trigger={['click']}>
        <UserInfo>
          <Avatar style={{ backgroundColor: '#FF4134' }} icon='user' />
          <UserName>{user?.names || user?.email || 'Usuario'}</UserName>
          <Icon type='down' style={{ marginLeft: 8, fontSize: 12 }} />
        </UserInfo>
      </Dropdown>
    </StyledHeader>
  )
}
