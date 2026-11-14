import { useEffect, useState, useCallback } from 'react'
import { Table, Card, Tag, Button, Icon, Drawer, Select, Input, Tabs, Badge, Empty, message, Divider } from 'antd'
import styled from 'styled-components'
import moment from 'moment'
import { Base } from '../layouts'
import { listAgentProposals, updateAgentProposal } from '../lib/apiAgentProposals'

moment.locale('es')

const { TabPane } = Tabs
const { Option } = Select
const { TextArea } = Input

const BRAND = '#FF4134'
const PAGE_SIZE = 20

// Estados de una propuesta (mismo enum que dbbz/models/agentProposal.js)
const STATUS = {
  nueva: { label: 'Nueva', color: 'red' },
  en_revision: { label: 'En revisión', color: 'orange' },
  aprobada: { label: 'Aprobada', color: 'blue' },
  creada: { label: 'Agente creado', color: 'green' },
  descartada: { label: 'Descartada', color: 'default' }
}
const STATUS_ORDER = ['nueva', 'en_revision', 'aprobada', 'creada', 'descartada']

const URGENCY = {
  ya: { label: 'Lo necesita ya', color: 'volcano' },
  pronto: { label: 'En unos meses', color: 'gold' },
  idea: { label: 'Solo una idea', color: 'default' }
}
const VOLUME = { pocas: 'Unas pocas al día', decenas: 'Decenas al día', cientos: 'Cientos al día' }
const CHANNEL = { whatsapp: 'WhatsApp', facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok', telegram: 'Telegram' }

const companyName = c => (c && (c.name || c.businessName)) || '—'

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`

const Muted = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
`

const Title = styled.div`
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
`

const Section = styled.div`
  margin-bottom: 20px;
`

const Label = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 6px;
`

const Quote = styled.div`
  padding: 12px 14px;
  border-left: 3px solid ${BRAND};
  border-radius: 6px;
  background: #fafbfc;
  white-space: pre-wrap;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.75);
`

const Facts = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
`

const DetailDrawer = ({ proposal, onClose, onSaved }) => {
  const [status, setStatus] = useState()
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (proposal) {
      setStatus(proposal.status)
      setNote(proposal.teamNote || '')
    }
  }, [proposal])

  if (!proposal) return null

  const dirty = status !== proposal.status || note !== (proposal.teamNote || '')

  const save = async () => {
    setSaving(true)
    const res = await updateAgentProposal(proposal._id, { status, teamNote: note })
    setSaving(false)
    if (res && res.success) {
      message.success('Propuesta actualizada')
      onSaved(res)
    } else {
      message.error((res && (res.error || res.message)) || 'No se pudo guardar')
    }
  }

  const mailto = proposal.userEmail
    ? `mailto:${proposal.userEmail}?subject=${encodeURIComponent(`Tu propuesta de agente: ${proposal.title}`)}`
    : null

  return (
    <Drawer
      title={<span><Icon type='bulb' style={{ color: BRAND, marginRight: 8 }} />{proposal.title}</span>}
      width={520}
      visible
      onClose={onClose}
      destroyOnClose
    >
      <Section>
        <Tag color={STATUS[proposal.status]?.color}>{STATUS[proposal.status]?.label || proposal.status}</Tag>
        <Muted style={{ display: 'inline' }}>
          Recibida {moment(proposal.createdAt).format('DD/MM/YYYY HH:mm')} ({moment(proposal.createdAt).fromNow()})
        </Muted>
      </Section>

      <Section>
        <Label>Cómo lo hacen hoy</Label>
        <Quote>{proposal.description}</Quote>
      </Section>

      <Section>
        <Facts>
          <div>
            <Label>Empresa</Label>
            <Title>{companyName(proposal.company)}</Title>
          </div>
          <div>
            <Label>Enviada por</Label>
            <Title>{proposal.userName || '—'}</Title>
            {mailto && <a href={mailto}>{proposal.userEmail}</a>}
          </div>
          <div>
            <Label>Urgencia</Label>
            {proposal.urgency ? <Tag color={URGENCY[proposal.urgency].color}>{URGENCY[proposal.urgency].label}</Tag> : <Muted>No indicó</Muted>}
          </div>
          <div>
            <Label>Volumen</Label>
            {proposal.volume ? VOLUME[proposal.volume] : <Muted>No indicó</Muted>}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Label>Canales</Label>
            {proposal.channels && proposal.channels.length
              ? proposal.channels.map(c => <Tag key={c}>{CHANNEL[c] || c}</Tag>)
              : <Muted>No indicó</Muted>}
          </div>
          {proposal.fromIdea && (
            <div style={{ gridColumn: '1 / -1' }}>
              <Label>Partió de la idea sugerida</Label>
              <Muted>«{proposal.fromIdea}»</Muted>
            </div>
          )}
        </Facts>
      </Section>

      <Divider />

      <Section>
        <Label>Estado</Label>
        <Select value={status} onChange={setStatus} style={{ width: '100%' }}>
          {STATUS_ORDER.map(s => <Option key={s} value={s}>{STATUS[s].label}</Option>)}
        </Select>
      </Section>

      <Section>
        <Label>Nota interna del equipo</Label>
        <TextArea
          rows={4}
          maxLength={2000}
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder='Ej.: Viable con el agente de seguimiento; falta confirmar horario con el cliente.'
        />
        <Muted style={{ marginTop: 4 }}>El cliente no ve esta nota.</Muted>
      </Section>

      <div style={{ display: 'flex', gap: 8 }}>
        {mailto && (
          <Button href={mailto} icon='mail' style={{ flex: 1 }}>
            Responder por correo
          </Button>
        )}
        <Button
          type='primary'
          loading={saving}
          disabled={!dirty}
          onClick={save}
          style={{ flex: 1, ...(dirty ? { backgroundColor: BRAND, borderColor: BRAND } : {}) }}
        >
          Guardar cambios
        </Button>
      </div>
    </Drawer>
  )
}

const columns = [
  {
    title: 'Recibida',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 130,
    render: d => (
      <div>
        <div>{moment(d).format('DD/MM/YYYY')}</div>
        <Muted>{moment(d).fromNow()}</Muted>
      </div>
    )
  },
  {
    title: 'Propuesta',
    key: 'title',
    render: (_, r) => (
      <div style={{ maxWidth: 420 }}>
        <Title>{r.title}</Title>
        <Muted style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.description}</Muted>
      </div>
    )
  },
  {
    title: 'Empresa',
    key: 'company',
    render: (_, r) => (
      <div>
        <div>{companyName(r.company)}</div>
        <Muted>{r.userName || r.userEmail}</Muted>
      </div>
    )
  },
  {
    title: 'Urgencia',
    dataIndex: 'urgency',
    key: 'urgency',
    render: u => (u ? <Tag color={URGENCY[u].color}>{URGENCY[u].label}</Tag> : <Muted>—</Muted>)
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    key: 'status',
    render: s => <Tag color={STATUS[s]?.color}>{STATUS[s]?.label || s}</Tag>
  }
]

const AgentProposalsPage = () => {
  const [tab, setTab] = useState('nueva')
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ items: [], total: 0, counts: {} })
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await listAgentProposals({
      status: tab === 'todas' ? undefined : tab,
      limit: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE
    })
    setLoading(false)
    if (res && Array.isArray(res.items)) setData(res)
    else message.error('No se pudieron cargar las propuestas')
  }, [tab, page])

  useEffect(() => { load() }, [load])

  const counts = data.counts || {}
  const all = STATUS_ORDER.reduce((sum, s) => sum + (counts[s] || 0), 0)

  const tabLabel = (text, count, highlight) => (
    <span>
      {text}{' '}
      <Badge
        count={count || 0}
        showZero
        overflowCount={999}
        style={highlight && count ? { backgroundColor: BRAND } : { backgroundColor: '#f0f0f0', color: 'rgba(0,0,0,0.55)' }}
      />
    </span>
  )

  const handleSaved = updated => {
    setSelected(updated)
    load()
  }

  return (
    <Base current='agent-proposals'>
      <Card
        title={<span><Icon type='bulb' style={{ color: BRAND, marginRight: 8 }} />Propuestas de Agentes IA</span>}
        extra={<Button icon='reload' onClick={load}>Actualizar</Button>}
      >
        <Toolbar>
          <Muted>
            Ideas que envían los clientes de pago desde “Agentes IA → Proponer un agente”.
            Revisa cada una, cambia su estado y responde al cliente por correo.
          </Muted>
        </Toolbar>

        <Tabs activeKey={tab} onChange={key => { setTab(key); setPage(1) }}>
          <TabPane tab={tabLabel('Nuevas', counts.nueva, true)} key='nueva' />
          <TabPane tab={tabLabel('En revisión', counts.en_revision)} key='en_revision' />
          <TabPane tab={tabLabel('Aprobadas', counts.aprobada)} key='aprobada' />
          <TabPane tab={tabLabel('Creadas', counts.creada)} key='creada' />
          <TabPane tab={tabLabel('Descartadas', counts.descartada)} key='descartada' />
          <TabPane tab={tabLabel('Todas', all)} key='todas' />
        </Tabs>

        <Table
          columns={columns}
          dataSource={data.items}
          loading={loading}
          rowKey='_id'
          scroll={{ x: true }}
          locale={{ emptyText: <Empty description='No hay propuestas en este estado' /> }}
          onRow={record => ({ onClick: () => setSelected(record), style: { cursor: 'pointer' } })}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total: data.total,
            onChange: setPage,
            hideOnSinglePage: true
          }}
        />
      </Card>

      {selected && (
        <DetailDrawer proposal={selected} onClose={() => setSelected(null)} onSaved={handleSaved} />
      )}
    </Base>
  )
}

export default AgentProposalsPage
