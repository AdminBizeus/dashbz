import { useState } from 'react'
import {
  Table, Card, Tag, Button, Icon, Modal, Form, Input,
  Select, InputNumber, DatePicker, Popconfirm, message, Divider, Alert, Tabs
} from 'antd'
import { Base } from '../layouts'
import { useSubscriptions, usePayments } from '../hooks'
import { triggerSubscriptionCheck } from 'utils/api/subscription'
import moment from 'moment'

const { TabPane } = Tabs

const { Option } = Select

const PLAN_LABELS = {
  free_trial: 'Prueba gratuita',
  basic:      'Básico',
  pro:        'Pro',
  enterprise: 'Personalizado'
}

const PLAN_DEFAULTS = {
  basic:      { usersLimit: 3,  connectionsLimit: 1, monthlyPrice: 39,   annualTotal: 374.40 },
  pro:        { usersLimit: 8,  connectionsLimit: 1, monthlyPrice: 89,   annualTotal: 854.40 },
  enterprise: { usersLimit: 10, connectionsLimit: 2, monthlyPrice: null, annualTotal: null }
}

const calculateEnterprisePrice = (users, connections, interval) => {
  let usersBase
  if (interval === 'annual') {
    if (users <= 3)      usersBase = 31.20
    else if (users <= 7) usersBase = 10 * users
    else                 usersBase = 8.9 * users
  } else {
    if (users <= 3)      usersBase = 39
    else if (users <= 7) usersBase = 12.5 * users
    else                 usersBase = 11.125 * users
  }
  const monthly = Math.round((usersBase + 20 * (connections - 1)) * 100) / 100
  return interval === 'annual' ? Math.round(monthly * 12 * 100) / 100 : monthly
}

const calcAmount = (plan, interval, usersLimit, connectionsLimit) => {
  if (plan === 'enterprise') {
    if (!usersLimit || !connectionsLimit) return null
    return calculateEnterprisePrice(usersLimit, connectionsLimit, interval)
  }
  const defaults = PLAN_DEFAULTS[plan]
  if (!defaults) return null
  return interval === 'annual' ? defaults.annualTotal : defaults.monthlyPrice
}

const STATUS_COLORS = {
  trial:    'blue',
  active:   'green',
  past_due: 'orange',
  canceled: 'default',
  expired:  'red'
}

const STATUS_LABELS = {
  trial:    'En prueba',
  active:   'Activo',
  past_due: 'Pago pendiente',
  canceled: 'Cancelado',
  expired:  'Expirado'
}

const columns = [
  {
    title: 'Creado',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: date => moment(date).format('DD/MM/YYYY')
  },
  {
    title: 'Compañía',
    dataIndex: 'company',
    key: 'company',
    render: company => company?.name || company?._id || '—'
  },
  {
    title: 'Plan',
    dataIndex: 'plan',
    key: 'plan',
    render: plan => PLAN_LABELS[plan] || plan
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    key: 'status',
    render: status => (
      <Tag color={STATUS_COLORS[status] || 'default'}>
        {STATUS_LABELS[status] || status}
      </Tag>
    )
  },
  {
    title: 'Tipo pago',
    key: 'paymentType',
    render: (_, record) => record.stripeSubscriptionId
      ? <Tag color='purple'>Stripe</Tag>
      : <Tag color='gold'>Transferencia</Tag>
  },
  {
    title: 'Período',
    key: 'period',
    render: (_, record) => record.currentPeriodStart
      ? `${moment(record.currentPeriodStart).format('DD/MM/YY')} – ${moment(record.currentPeriodEnd).format('DD/MM/YY')}`
      : '—'
  },
  {
    title: 'Usuarios',
    dataIndex: 'usersLimit',
    key: 'usersLimit',
    render: v => v === -1 ? 'Ilimitados' : v
  },
  {
    title: 'Conexiones',
    dataIndex: 'connectionsLimit',
    key: 'connectionsLimit',
    render: v => v === -1 ? 'Ilimitadas' : v
  },
  {
    title: 'Acceso',
    dataIndex: 'hasAccessToServices',
    key: 'hasAccessToServices',
    render: v => <Tag color={v ? 'green' : 'red'}>{v ? 'Sí' : 'No'}</Tag>
  },
  {
    title: 'Acciones',
    key: 'actions',
    render: (_, record) => (
      <Popconfirm
        title='¿Eliminar suscripción? Se borrará todo su historial y la empresa quedará sin plan activo.'
        onConfirm={() => record._onDelete(record._id)}
        okText='Sí, eliminar'
        cancelText='Cancelar'
        okType='danger'
      >
        <Button type='danger' size='small' icon='delete'>
          Eliminar
        </Button>
      </Popconfirm>
    )
  }
]

const initialForm = {
  userEmail: '',
  plan: 'basic',
  interval: 'monthly',
  periodStart: null,
  periodEnd: null,
  usersLimit: 3,
  connectionsLimit: 1,
  amount: 39
}

const paymentColumns = [
  {
    title: 'Fecha',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: date => moment(date).format('DD/MM/YYYY HH:mm')
  },
  {
    title: 'Compañía',
    dataIndex: 'company',
    key: 'company',
    render: c => c?.name || c?._id || '—'
  },
  {
    title: 'Método',
    dataIndex: 'method',
    key: 'method',
    render: m => m === 'stripe'
      ? <Tag color='purple'>Stripe</Tag>
      : <Tag color='gold'>Transferencia</Tag>
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    key: 'status',
    render: s => {
      const colors = { paid: 'green', failed: 'red', pending: 'orange' }
      const labels = { paid: 'Pagado', failed: 'Fallido', pending: 'Pendiente' }
      return <Tag color={colors[s] || 'default'}>{labels[s] || s}</Tag>
    }
  },
  {
    title: 'Plan',
    dataIndex: 'plan',
    key: 'plan',
    render: p => ({ free_trial: 'Prueba', basic: 'Básico', pro: 'Pro', enterprise: 'Personalizado' }[p] || p || '—')
  },
  {
    title: 'Intervalo',
    dataIndex: 'interval',
    key: 'interval',
    render: v => v === 'annual' ? 'Anual' : v === 'monthly' ? 'Mensual' : '—'
  },
  {
    title: 'Monto',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount, record) => amount != null
      ? `${(amount / 100).toFixed(2)} ${(record.currency || 'usd').toUpperCase()}`
      : '—'
  },
  {
    title: 'Período',
    key: 'period',
    render: (_, r) => r.periodStart
      ? `${moment(r.periodStart).format('DD/MM/YY')} – ${moment(r.periodEnd).format('DD/MM/YY')}`
      : '—'
  },
  {
    title: 'Invoice Stripe',
    dataIndex: 'stripeInvoiceId',
    key: 'stripeInvoiceId',
    render: v => v ? <Tag>{v}</Tag> : '—'
  }
]

const SubscriptionsPage = () => {
  const { subscriptions, loading, loadingCreate, refresh, createManualSubscription, deleteSubscription } = useSubscriptions()
  const { payments, loading: loadingPayments, refresh: refreshPayments } = usePayments()

  const handleDelete = (id) => {
    deleteSubscription(id, {
      onSuccess: () => {
        message.success('Suscripción eliminada correctamente')
        refresh()
      },
      onError: () => message.error('Error al eliminar la suscripción')
    })
  }

  const tableData = subscriptions.map(s => ({ ...s, _onDelete: handleDelete }))

  const [loadingCheck, setLoadingCheck] = useState(false)
  const [checkResult, setCheckResult] = useState(null)

  const handleTriggerCheck = async () => {
    setLoadingCheck(true)
    setCheckResult(null)
    try {
      const result = await triggerSubscriptionCheck()
      setCheckResult(result)
      if (result.expiredCount > 0) {
        message.warning(`${result.expiredCount} suscripción(es) expiradas procesadas`)
        refresh()
      } else {
        message.success('Verificación completada — sin cambios')
      }
    } catch {
      message.error('Error al ejecutar la verificación')
    } finally {
      setLoadingCheck(false)
    }
  }
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  const setField = (field, value) => {
    setErrors(prev => ({ ...prev, [field]: undefined }))
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'plan' && PLAN_DEFAULTS[value]) {
        next.usersLimit = PLAN_DEFAULTS[value].usersLimit
        next.connectionsLimit = PLAN_DEFAULTS[value].connectionsLimit
        next.amount = calcAmount(value, prev.interval, next.usersLimit, next.connectionsLimit)
      }
      if (field === 'interval') {
        next.amount = calcAmount(prev.plan, value, prev.usersLimit, prev.connectionsLimit)
      }
      if (field === 'usersLimit' || field === 'connectionsLimit') {
        const users       = field === 'usersLimit'       ? value : prev.usersLimit
        const connections = field === 'connectionsLimit' ? value : prev.connectionsLimit
        next.amount = calcAmount(prev.plan, prev.interval, users, connections)
      }
      return next
    })
  }

  const validate = () => {
    const errs = {}
    if (!form.userEmail || !/\S+@\S+\.\S+/.test(form.userEmail)) errs.userEmail = 'Email inválido'
    if (!form.plan) errs.plan = 'Selecciona un plan'
    if (!form.periodStart) errs.periodStart = 'Selecciona la fecha de inicio'
    if (!form.periodEnd) errs.periodEnd = 'Selecciona la fecha de fin'
    if (form.periodStart && form.periodEnd && !form.periodEnd.isAfter(form.periodStart)) errs.periodEnd = 'La fecha de fin debe ser posterior al inicio'
    if (form.amount == null || form.amount <= 0) errs.amount = 'Ingresa el monto del pago'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const payload = {
      ...form,
      periodStart: form.periodStart.toISOString(),
      periodEnd: form.periodEnd.toISOString()
    }
    createManualSubscription(payload, {
      onSuccess: () => {
        message.success('Suscripción creada correctamente')
        setModalOpen(false)
        setForm(initialForm)
        setErrors({})
        refresh()
      },
      onError: err => {
        message.error(err?.message || 'Error al crear la suscripción')
      }
    })
  }

  const handleClose = () => {
    setModalOpen(false)
    setForm(initialForm)
    setErrors({})
  }

  return (
    <Base current='subscriptions'>
      <Card>
        <Tabs defaultActiveKey='subscriptions'>
          <TabPane tab='Suscripciones' key='subscriptions'>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 16 }}>
              <Button
                type='primary'
                onClick={() => setModalOpen(true)}
                style={{ backgroundColor: '#FF4134', borderColor: '#FF4134' }}
              >
                <Icon type='plus' /> Nueva suscripción manual
              </Button>
              <Button loading={loadingCheck} onClick={handleTriggerCheck} icon='thunderbolt'>
                Verificar vencimientos
              </Button>
              <Button onClick={refresh} icon='reload'>
                Actualizar
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={tableData}
              loading={loading}
              rowKey='_id'
              pagination={{ pageSize: 15 }}
              scroll={{ x: true }}
            />

            {checkResult && (
              <div style={{ marginTop: 16 }}>
                <Alert
                  type={checkResult.expiredCount > 0 ? 'warning' : 'success'}
                  message={
                    checkResult.expiredCount > 0
                      ? `${checkResult.expiredCount} suscripción(es) expiradas — acceso revocado`
                      : 'Todo en orden — no hay suscripciones vencidas'
                  }
                  description={
                    checkResult.expiredCount > 0 && checkResult.results
                      ? checkResult.results.map((r, i) => (
                        <div key={i} style={{ fontSize: 12, marginTop: 4 }}>
                          {r.error
                            ? `❌ Sub ${r.subscriptionId}: ${r.error}`
                            : `✅ Empresa ${r.companyId} — acceso revocado`
                          }
                        </div>
                      ))
                      : null
                  }
                  showIcon
                  closable
                  onClose={() => setCheckResult(null)}
                />
              </div>
            )}
          </TabPane>

          <TabPane tab='Historial de pagos' key='payments'>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Button onClick={refreshPayments} icon='reload'>Actualizar</Button>
            </div>
            <Table
              columns={paymentColumns}
              dataSource={payments}
              loading={loadingPayments}
              rowKey='_id'
              pagination={{ pageSize: 15 }}
              scroll={{ x: true }}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title='Nueva suscripción por transferencia'
        visible={modalOpen}
        onCancel={handleClose}
        footer={null}
        width={480}
        destroyOnClose
      >
        <Form layout='vertical'>
          <Form.Item
            label='Email del usuario'
            validateStatus={errors.userEmail ? 'error' : ''}
            help={errors.userEmail}
          >
            <Input
              placeholder='cliente@empresa.com'
              value={form.userEmail}
              onChange={e => setField('userEmail', e.target.value)}
            />
          </Form.Item>

          <Divider style={{ margin: '12px 0' }} />

          <div style={{ display: 'flex', gap: 12 }}>
            <Form.Item label='Plan' style={{ flex: 1 }}>
              <Select value={form.plan} onChange={v => setField('plan', v)}>
                <Option value='basic'>Básico</Option>
                <Option value='pro'>Pro</Option>
                <Option value='enterprise'>Personalizado</Option>
              </Select>
            </Form.Item>

            <Form.Item label='Facturación' style={{ flex: 1 }}>
              <Select value={form.interval} onChange={v => setField('interval', v)}>
                <Option value='monthly'>Mensual</Option>
                <Option value='annual'>Anual</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label='Fecha de inicio'
            validateStatus={errors.periodStart ? 'error' : ''}
            help={errors.periodStart}
          >
            <DatePicker
              style={{ width: '100%' }}
              format='DD/MM/YYYY'
              value={form.periodStart}
              onChange={v => setField('periodStart', v)}
              disabledDate={current => form.periodEnd && current && current.isAfter(form.periodEnd)}
            />
          </Form.Item>

          <Form.Item
            label='Fecha de fin'
            validateStatus={errors.periodEnd ? 'error' : ''}
            help={errors.periodEnd}
          >
            <DatePicker
              style={{ width: '100%' }}
              format='DD/MM/YYYY'
              value={form.periodEnd}
              onChange={v => setField('periodEnd', v)}
              disabledDate={current => form.periodStart && current && current.isBefore(form.periodStart)}
            />
          </Form.Item>

          <Divider style={{ margin: '12px 0' }} />

          <div style={{ display: 'flex', gap: 12 }}>
            <Form.Item label='Límite de usuarios' style={{ flex: 1, marginBottom: 12 }}>
              <InputNumber
                min={1}
                style={{ width: '100%' }}
                value={form.usersLimit}
                onChange={v => setField('usersLimit', v)}
              />
            </Form.Item>

            <Form.Item label='Límite de conexiones' style={{ flex: 1, marginBottom: 12 }}>
              <InputNumber
                min={1}
                style={{ width: '100%' }}
                value={form.connectionsLimit}
                onChange={v => setField('connectionsLimit', v)}
              />
            </Form.Item>
          </div>

          <Form.Item
            label='Monto (USD)'
            validateStatus={errors.amount ? 'error' : ''}
            help={errors.amount}
          >
            <InputNumber
              min={0.01}
              step={0.01}
              precision={2}
              style={{ width: '100%' }}
              value={form.amount}
              onChange={v => setField('amount', v)}
              formatter={v => `$ ${v}`}
              parser={v => v.replace(/\$\s?/, '')}
            />
          </Form.Item>

          <Button
            type='primary'
            block
            loading={loadingCreate}
            onClick={handleSubmit}
            style={{ backgroundColor: '#FF4134', borderColor: '#FF4134', marginTop: 8 }}
          >
            Crear suscripción
          </Button>
        </Form>
      </Modal>
    </Base>
  )
}

export default SubscriptionsPage
