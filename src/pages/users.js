import { useState } from 'react'
import { Table, Card, Tag, Button, Icon, Modal, Input, Alert, message } from 'antd'
import { createResetLink } from 'utils/api/users'
import { Base } from '../layouts'
import { useUsers } from '../hooks'
import moment from 'moment'

// Número para wa.me: solo dígitos con código de país (los usuarios nuevos ya
// guardan `mobile` con el código; los antiguos lo tienen en mobileCode).
const whatsappNumber = user => {
  const mobile = String((user && user.mobile) || '').replace(/\D/g, '')
  if (!mobile) return ''
  const code = String((user && user.mobileCode) || '')
  return code && !mobile.startsWith(code) && mobile.length <= 10 ? code + mobile : mobile
}

/**
 * Restablecer contraseña desde soporte: genera un enlace de un solo uso
 * (30 min) para el usuario; se le pasa por WhatsApp tras verificar que es él.
 * Generar otro invalida el anterior. Requiere ser staff (SUPPORT_AGENT_EMAILS).
 */
const ResetLinkModal = ({ user, onClose }) => {
  const [state, setState] = useState({})

  const generate = async () => {
    setState({ loading: true })
    const resp = await createResetLink(user._id)
    if (resp && resp.success && resp.url) setState({ url: resp.url, expiresAt: resp.expiresAt })
    else setState({ error: (resp && (resp.message || resp.error)) || 'No se pudo generar el enlace.' })
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(state.url)
      message.success('Enlace copiado')
    } catch (e) {
      message.info('Selecciona el enlace y cópialo a mano')
    }
  }

  const first = ((user && user.names) || '').split(' ')[0]
  const until = state.expiresAt ? moment(state.expiresAt).format('HH:mm') : ''
  const text = `Hola ${first}, este es tu enlace para crear una nueva contraseña de Bizeus (vence a las ${until}): ${state.url}`
  const waUrl = `https://wa.me/${whatsappNumber(user)}?text=${encodeURIComponent(text)}`

  return (
    <Modal
      visible={!!user}
      title='Restablecer contraseña'
      onCancel={onClose}
      footer={<Button onClick={onClose}>Cerrar</Button>}
      destroyOnClose
    >
      <p>
        <b>{user && user.names}</b> · {user && user.email}<br />
        Empresa: <code>{user && String(user.company)}</code>
      </p>
      <Alert
        type='warning'
        showIcon
        style={{ marginBottom: 16 }}
        message='Antes de generar, confirma que quien lo pide es el dueño de la cuenta (p. ej. escribe desde el WhatsApp registrado).'
      />
      {state.error && <Alert type='error' message={state.error} style={{ marginBottom: 16 }} />}
      {state.url ? (
        <>
          <Input readOnly value={state.url} onFocus={e => e.target.select()} style={{ marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <Button icon='copy' onClick={copy}>Copiar</Button>
            <Button type='primary' icon='message' href={waUrl} target='_blank' rel='noopener noreferrer' style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}>
              Enviar por WhatsApp
            </Button>
            <Button onClick={generate} loading={state.loading}>Generar otro</Button>
          </div>
          <small>Un solo uso · vence a las {until} · al usarlo se cierran sus sesiones.</small>
        </>
      ) : (
        <Button type='primary' icon='key' loading={state.loading} onClick={generate} style={{ backgroundColor: '#FF4134', borderColor: '#FF4134' }}>
          Generar enlace
        </Button>
      )}
    </Modal>
  )
}

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
  const [resetUser, setResetUser] = useState(null)
  const tableColumns = [
    ...columns,
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => record.rol === 'Contact' ? null : (
        <Button size='small' icon='key' onClick={() => setResetUser(record)}>Restablecer</Button>
      )
    }
  ]
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
          columns={tableColumns}
          dataSource={users}
          loading={loading}
          rowKey='_id'
          pagination={{ pageSize: 10 }}
        />
      </Card>
      {resetUser && <ResetLinkModal user={resetUser} onClose={() => setResetUser(null)} />}
    </Base>
  )
}

export default UsersPage
