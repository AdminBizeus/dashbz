import { Table, Card, Tag, Button, Icon } from 'antd'
import { Base } from '../layouts'
import { useUsers } from '../hooks'
import moment from 'moment'

const columns = [
  {
    title: 'Creado',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date) => moment(date).format('DD/MM/YYYY')
  },
  {
    title: 'Compañia',
    dataIndex: 'company',
    key: 'company'
  },
  {
    title: 'ID',
    dataIndex: '_id',
    key: '_id'
  },
  {
    title: 'Nombre',
    dataIndex: 'names',
    key: 'names',
    render: (text, record) => text || record.email
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
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
  },
  {
    title: 'Rol',
    dataIndex: 'rol',
    key: 'rol',
    render: (rol) => {
      const colors = {
        Admin: 'red',
        User: 'blue',
        Assessor: 'green'
      }
      return <Tag color={colors[rol] || 'default'}>{rol}</Tag>
    }
  },
  {
    title: 'Ver todos los chats',
    dataIndex: 'seeAll',
    key: 'seeAll',
    render: (seeAll) => seeAll ? 'Sí' : 'No'
  },
  {
    title: 'Firmar los chats',
    dataIndex: 'isSend',
    key: 'isSend',
    render: (isSend) => isSend ? 'Sí' : 'No'
  }
]

const UsersPage = () => {
  const { users, loading, refresh } = useUsers({populate: ['teams']})
  console.log('users', users)
  return (
    <Base current='users'>
      <Card
        title='Usuarios'
        extra={
          <Button type='primary' onClick={refresh} style={{ backgroundColor: '#FF4134', borderColor: '#FF4134' }}>
            <Icon type='reload' /> Actualizar
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey='_id'
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </Base>
  )
}

export default UsersPage
