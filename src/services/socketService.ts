/* eslint-disable @typescript-eslint/no-explicit-any */
import { SOCKET_URL } from '@/config/config'
/* import { type Task } from '@/types/Task' */
import { io, type Socket } from 'socket.io-client'

export type SocketEvent =
  | 'taskList'
  | 'taskCreated'
  | 'taskUpdated'
  | 'taskDeleted'
  | 'taskMoved'
  | 'error'

/* interface EventCallbackMap {
  taskList: (tasks: Task[]) => void
  taskCreated: (task: Task) => void
  taskUpdated: (task: Task) => void
  taskDeleted: (taskId: string) => void
  taskMoved: (payload: { taskId: string, newStatus: Task['status'] }) => void
  error: (error: { message: string }) => void
} */

let socket: Socket | null = null

export const socketService = {
  connect (
    token: string,
    onConnect: () => void,
    onDisconnect: () => void
  ): void {
    if (socket === null) {
      const socketUrl: string = `${SOCKET_URL}/tasks`
      socket = io(socketUrl, {
        auth: {
          token
        },
        reconnection: true,
        reconnectionAttempts: 3,
        transports: ['websocket', 'polling']
        /* transports: ['websocket'] */
      })

      socket.on('connect', () => {
        console.log('Socket connected')
        onConnect()
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected')
        onDisconnect()
      })

      socket.on('error', (error: Error) => {
        console.error('Error en el socket:', error)
      })
    }
  },

  disconnect (): void {
    if (socket !== null) {
      socket.disconnect()
      socket = null
    }
  },

  on (event: string, callback: (...args: any[]) => void): void {
    if (socket !== null) {
      socket.on(event, callback)
    }
    console.log('Socket event:', event)
  },

  off (event: string, callback: (...args: any[]) => void): void {
    if (socket !== null) {
      socket.off(event, callback)
    }
  },

  emit (event: string, data: any): void {
    if (socket !== null) {
      console.log('Emitting event:', event)
      socket.emit(event, data)
    }
  },

  isConnected (): boolean {
    return (socket?.connected) ?? false
  }
}
