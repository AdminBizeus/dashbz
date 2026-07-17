import { useEffect, useRef, useState } from 'react'
import { List, Card, Tag, Badge, Avatar, Input, Button, Icon, Empty, Spin } from 'antd'
import styled from 'styled-components'
import moment from 'moment'
import { Base } from '../layouts'
import { useSupportInbox } from '../hooks'
import { FILE_PUBLIC_BASE_URL } from '../lib/fileUrl'

moment.locale('es')

const Wrapper = styled.div`
  display: flex;
  height: calc(100vh - 220px);
  min-height: 420px;
`

const Sidebar = styled.div`
  width: 340px;
  border-right: 1px solid #e8e8e8;
  overflow-y: auto;
`

const ChatItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  background: ${props => (props.active ? '#fff1ef' : '#fff')};
  &:hover {
    background: ${props => (props.active ? '#fff1ef' : '#fafafa')};
  }
`

const ChatItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ChatItemName = styled.span`
  font-weight: 600;
  color: rgba(0, 0, 0, 0.75);
`

const ChatItemTime = styled.span`
  font-size: 11px;
  color: rgba(0, 0, 0, 0.4);
`

const ChatItemPreview = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
`

const Panel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const PanelHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fafbfc;
`

const Row = styled.div`
  display: flex;
  justify-content: ${props => (props.agent ? 'flex-end' : 'flex-start')};
  margin-bottom: 10px;
`

const Bubble = styled.div`
  max-width: 65%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 13px;
  background: ${props => (props.agent ? '#FF4134' : '#fff')};
  color: ${props => (props.agent ? '#fff' : 'rgba(0, 0, 0, 0.75)')};
  border: ${props => (props.agent ? 'none' : '1px solid #e8e8e8')};
  a {
    color: ${props => (props.agent ? '#fff' : undefined)};
    text-decoration: underline;
  }
`

const BubbleMeta = styled.div`
  font-size: 10px;
  margin-top: 3px;
  text-align: right;
  color: ${props => (props.agent ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.35)')};
`

const SystemMsg = styled.div`
  text-align: center;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.4);
  margin: 8px 0;
`

const InputBar = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e8e8e8;
  background: #fff;
`

const chatUserName = chat => {
  const user = chat.user || {}
  return user.names ||
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    user.email || 'Usuario'
}

const SupportPage = () => {
  const {
    list, messages, current, currentChat,
    loading, loadingMessages, sending,
    openChat, reply, replyMedia, setStatus
  } = useSupportInbox()

  const [text, setText] = useState('')
  const bottomRef = useRef(null)
  const fileRef = useRef(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length])

  const handleSend = () => {
    const value = text.trim()
    if (!value || sending) return
    reply(value)
    setText('')
  }

  const handleFile = event => {
    const file = event.target.files && event.target.files[0]
    if (!file) return
    replyMedia(file)
    event.target.value = null
  }

  const renderMessage = message => {
    if (message.sender === 'system') {
      return <SystemMsg key={message._id}>{message.text}</SystemMsg>
    }

    const agent = message.sender === 'agent'
    return (
      <Row key={message._id} agent={agent}>
        <Bubble agent={agent}>
          {message.url && message.typeMsg === 'image' && (
            <a href={`${FILE_PUBLIC_BASE_URL}${message.url}`} target='_blank' rel='noopener noreferrer'>
              <img
                src={`${FILE_PUBLIC_BASE_URL}${message.url}`}
                alt=''
                style={{ maxWidth: '100%', borderRadius: 8, display: 'block', marginBottom: 4 }}
              />
            </a>
          )}
          {message.url && message.typeMsg !== 'image' && (
            <a href={`${FILE_PUBLIC_BASE_URL}${message.url}`} target='_blank' rel='noopener noreferrer'>
              <Icon type='paper-clip' /> {message.text || 'Archivo adjunto'}
            </a>
          )}
          {message.text && !message.url && <span>{message.text}</span>}
          <BubbleMeta agent={agent}>
            {agent && message.agentName ? `${message.agentName} · ` : ''}
            {moment(message.createdAt).format('DD/MM HH:mm')}
          </BubbleMeta>
        </Bubble>
      </Row>
    )
  }

  return (
    <Base current='support'>
      <Card title='Soporte — Atención por chat' bodyStyle={{ padding: 0 }}>
        <Wrapper>
          <Sidebar>
            {loading && <div style={{ padding: 24, textAlign: 'center' }}><Spin /></div>}
            {!loading && list.length === 0 && (
              <Empty style={{ marginTop: 40 }} description='Sin conversaciones' />
            )}
            {list.map(chat => (
              <ChatItem
                key={chat._id}
                active={current === chat._id}
                onClick={() => openChat(chat)}
              >
                <ChatItemTop>
                  <div>
                    <Badge count={chat.countAgent} offset={[8, 0]}>
                      <ChatItemName>{chatUserName(chat)}</ChatItemName>
                    </Badge>
                  </div>
                  <ChatItemTime>{moment(chat.updatedAt).format('DD/MM HH:mm')}</ChatItemTime>
                </ChatItemTop>
                <ChatItemPreview>
                  {chat.company && chat.company.name ? `${chat.company.name} · ` : ''}
                  {chat.lastMessage || 'Sin mensajes'}
                </ChatItemPreview>
                <div style={{ marginTop: 4 }}>
                  <Tag color={chat.status === 'abierto' ? 'orange' : 'green'}>
                    {chat.status}
                  </Tag>
                </div>
              </ChatItem>
            ))}
          </Sidebar>

          <Panel>
            {!currentChat && (
              <Empty
                style={{ margin: 'auto' }}
                description='Selecciona una conversación para responder'
              />
            )}

            {currentChat && (
              <>
                <PanelHeader>
                  <div>
                    <Avatar
                      style={{ backgroundColor: '#FF4134', marginRight: 8 }}
                      icon='user'
                      src={currentChat.user && currentChat.user.photo
                        ? `${FILE_PUBLIC_BASE_URL}${currentChat.user.photo}`
                        : undefined}
                    />
                    <strong>{chatUserName(currentChat)}</strong>
                    {currentChat.company && currentChat.company.name && (
                      <span style={{ marginLeft: 8, color: 'rgba(0,0,0,0.45)' }}>
                        ({currentChat.company.name})
                      </span>
                    )}
                  </div>
                  {currentChat.status === 'abierto' ? (
                    <Button size='small' onClick={() => setStatus('resuelto')}>
                      <Icon type='check' /> Marcar resuelto
                    </Button>
                  ) : (
                    <Button size='small' onClick={() => setStatus('abierto')}>
                      <Icon type='rollback' /> Reabrir
                    </Button>
                  )}
                </PanelHeader>

                <MessagesArea>
                  {loadingMessages && <div style={{ textAlign: 'center' }}><Spin /></div>}
                  {!loadingMessages && messages.map(renderMessage)}
                  <div ref={bottomRef} />
                </MessagesArea>

                <InputBar>
                  <Input
                    placeholder='Escribe una respuesta…'
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onPressEnter={handleSend}
                    disabled={sending}
                  />
                  <Button
                    onClick={() => fileRef.current && fileRef.current.click()}
                    disabled={sending}
                    title='Adjuntar archivo'
                  >
                    <Icon type='paper-clip' />
                  </Button>
                  <input ref={fileRef} type='file' style={{ display: 'none' }} onChange={handleFile} />
                  <Button
                    type='primary'
                    onClick={handleSend}
                    loading={sending}
                    style={{ backgroundColor: '#FF4134', borderColor: '#FF4134' }}
                  >
                    <Icon type='right' /> Enviar
                  </Button>
                </InputBar>
              </>
            )}
          </Panel>
        </Wrapper>
      </Card>
    </Base>
  )
}

export default SupportPage
