import { Card, Row, Col, Statistic, Icon } from 'antd'
import { Base } from '../layouts'
import { useUsers, useConnections } from '../hooks'

const HomePage = () => {
  const { users } = useUsers()
  const { connections } = useConnections()

  return (
    <Base current='home'>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title='Usuarios'
              value={users.length}
              prefix={<Icon type='user' />}
              valueStyle={{ color: '#FF4134' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title='Conexiones'
              value={connections.length}
              prefix={<Icon type='api' />}
              valueStyle={{ color: '#FF4134' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title='Conexiones Activas'
              value={connections.filter(c => c.status === 'connected').length}
              prefix={<Icon type='check-circle' />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>
    </Base>
  )
}

export default HomePage
