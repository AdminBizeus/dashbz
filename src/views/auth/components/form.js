import { Form, Icon, Input, Button, Alert } from 'antd'

const Login = ({ error, loading, handleLogin, form }) => {
  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        handleLogin(values.username, values.password)
      }
    })
  }
  const { getFieldDecorator } = form
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Ingresa tu email!' }]
        })(
          <Input
            prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder='Email'
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Ingresa tu contraseña!' }]
        })(
          <Input
            prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
            type='password'
            placeholder='Contraseña'
          />
        )}
      </Form.Item>
      <Form.Item>
        {error && <Alert type='error' description={error} style={{ marginBottom: 16 }} />}
        <Button
          type='primary'
          htmlType='submit'
          loading={loading}
          block
          style={{ backgroundColor: '#FF4134', borderColor: '#FF4134' }}
        >
          Iniciar Sesión
        </Button>
      </Form.Item>
    </Form>
  )
}

export const LoginForm = Form.create({ name: 'login' })(Login)
