import { Table, Card, Tag, Button, Icon } from 'antd'
import { Base } from '../layouts'
import { useConnections } from '../hooks'
import moment from 'moment'

const columns = [
  {
    title: 'Creado',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date) => moment(date).format('DD/MM/YYYY')
  },
  {
    title: 'ID',
    dataIndex: '_id',
    key: '_id'
  },
  {
    title: 'Nombre',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Canal',
    dataIndex: 'channel',
    key: 'channel',
    render: (channel) => {
      const colors = {
        'whatsapp': 'green',
        'whatsapp-waha': 'cyan',
        'cloud-api': 'blue',
        'facebook': 'geekblue',
        'instagram': 'purple'
      }
      return <Tag color={colors[channel] || 'default'}>{channel}</Tag>
    }
  },
  {
    title: 'PhoneNoId',
    dataIndex: 'phoneNoId',
    key: 'phoneNoId'
  },
  {
    title: 'IdInstance',
    dataIndex: 'idInstance',
    key: 'idInstance'
  },
  {
    title: 'isReady',
    dataIndex: 'isReady',
    key: 'isReady',
    render: (isReady) => isReady ? 'Sí' : 'No'
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const colors = {
        'connected': 'green',
        "WORKING": 'green',
        "authorized": 'green',
        'disconnected': 'red',
        "notAuthorized": 'red',
        "NonStatus": 'orange',
        'pending': 'orange'
      }
      return <Tag color={colors[status] || 'default'}>{status || 'N/A'}</Tag>
    }
  },
  {
    title: 'Teléfono',
    dataIndex: 'mobile',
    key: 'mobile',
    render: (mobile) => mobile || 'N/A'
  },
  {
    title: 'Equipos',
    dataIndex: 'teams',
    key: 'teams',
    render: (teams) => {
      if (!teams || teams.length === 0) return 'N/A'
      return teams.map(team => (
        <Tag key={team._id} color={team.color}>{team.name}</Tag>
      ))
    }
  }
]

const ConnectionsPage = () => {
  const { connections, loading, refresh } = useConnections({populate: ['company', 'teams']})
  
  return (
    <Base current='connections'>
      <Card
        title='Conexiones'
        extra={
          <Button type='primary' onClick={refresh} style={{ backgroundColor: '#FF4134', borderColor: '#FF4134' }}>
            <Icon type='reload' /> Actualizar
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={connections}
          loading={loading}
          rowKey='_id'
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </Base>
  )
}

export default ConnectionsPage
