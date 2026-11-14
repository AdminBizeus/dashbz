import { get, put } from 'utils/lib/request'

// Propuestas de Agentes IA (las envían los clientes desde crmbz /agents).
// Vive aquí y no en utilsbz: solo la usa dashbz.

// params = { status, skip, limit } → { items, total, counts }
export const listAgentProposals = params => get('/agent-proposals/inbox', params)

// data = { status, teamNote } → propuesta actualizada + success
export const updateAgentProposal = (id, data) => put(`/agent-proposals/${id}`, data)
