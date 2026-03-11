import { Table, Card, Tag, Button, Icon } from 'antd'
import { Base } from '../layouts'
import { useCompanies } from '../hooks'
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
    title: 'Suscrito',
    dataIndex: 'subscribed',
    key: 'subscribed',
    render: (subscribed) => (
      <Tag color={subscribed ? 'green' : 'red'}>
        {subscribed ? 'Sí' : 'No'}
      </Tag>
    )
  }
]

const CompaniesPage = () => {
  const { companies, loading, refresh } = useCompanies()

  return (
    <Base current='companies'>
      <Card
        title='Compañías'
        extra={
          <Button type='primary' onClick={refresh} style={{ backgroundColor: '#FF4134', borderColor: '#FF4134' }}>
            <Icon type='reload' /> Actualizar
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={companies}
          loading={loading}
          rowKey='_id'
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </Base>
  )
}

export default CompaniesPage
