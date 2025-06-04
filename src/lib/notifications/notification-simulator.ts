// Notification simulator for demo purposes
// Simulates real-time notifications without requiring a backend server

import { socketClient } from './socket-client'

class NotificationSimulator {
  private isRunning = false
  private intervals: NodeJS.Timeout[] = []

  start() {
    if (this.isRunning) return
    
    this.isRunning = true
    console.log('Starting notification simulator...')

    // Simulate various types of notifications
    this.simulateGeneralNotifications()
    this.simulateCandidateUpdates()
    this.simulateSystemNotifications()
    this.simulateChatActivity()
  }

  stop() {
    this.isRunning = false
    this.intervals.forEach(interval => clearInterval(interval))
    this.intervals = []
    console.log('Notification simulator stopped')
  }

  private simulateGeneralNotifications() {
    const interval = setInterval(() => {
      if (!this.isRunning) return

      const notifications = [
        {
          id: `notif_${Date.now()}`,
          type: 'success' as const,
          title: 'Candidato contratado',
          message: 'Juan Pérez ha sido contratado para el puesto de Desarrollador Senior',
          timestamp: new Date(),
          read: false,
          userId: 'current_user',
          data: { candidateId: '123', position: 'Desarrollador Senior' }
        },
        {
          id: `notif_${Date.now() + 1}`,
          type: 'info' as const,
          title: 'Nueva aplicación',
          message: 'María García ha aplicado para el puesto de Diseñadora UX',
          timestamp: new Date(),
          read: false,
          userId: 'current_user',
          data: { candidateId: '124', position: 'Diseñadora UX' }
        },
        {
          id: `notif_${Date.now() + 2}`,
          type: 'warning' as const,
          title: 'Entrevista pendiente',
          message: 'Recordatorio: Entrevista con Carlos López en 30 minutos',
          timestamp: new Date(),
          read: false,
          userId: 'current_user',
          data: { candidateId: '125', interviewTime: new Date(Date.now() + 30 * 60 * 1000) }
        }
      ]

      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
      
      // Emit through socket client to trigger listeners
      socketClient.on('notification', () => {}) // Ensure listener exists
      setTimeout(() => {
        const listeners = (socketClient as any).listeners.get('notification') || []
        listeners.forEach((callback: Function) => callback(randomNotification))
      }, 100)

    }, 60000) // Every minute

    this.intervals.push(interval)
  }

  private simulateCandidateUpdates() {
    const interval = setInterval(() => {
      if (!this.isRunning) return

      const updates = [
        {
          id: `update_${Date.now()}`,
          type: 'info' as const,
          title: 'Evaluación completada',
          message: 'La evaluación IA de Ana Martín ha sido completada',
          timestamp: new Date(),
          read: false,
          userId: 'current_user',
          data: { candidateId: '126', evaluationScore: 85 }
        },
        {
          id: `update_${Date.now() + 1}`,
          type: 'success' as const,
          title: 'Candidato actualizado',
          message: 'Se ha actualizado la información de Roberto Silva',
          timestamp: new Date(),
          read: false,
          userId: 'current_user',
          data: { candidateId: '127', updateType: 'profile' }
        }
      ]

      const randomUpdate = updates[Math.floor(Math.random() * updates.length)]
      
      setTimeout(() => {
        const listeners = (socketClient as any).listeners.get('notification') || []
        listeners.forEach((callback: Function) => callback(randomUpdate))
      }, 100)

    }, 90000) // Every 1.5 minutes

    this.intervals.push(interval)
  }

  private simulateSystemNotifications() {
    const interval = setInterval(() => {
      if (!this.isRunning) return

      const systemNotifications = [
        {
          id: `sys_${Date.now()}`,
          type: 'info' as const,
          title: 'Reporte generado',
          message: 'El reporte mensual de reclutamiento está listo para descargar',
          timestamp: new Date(),
          read: false,
          userId: 'current_user',
          data: { reportType: 'monthly', downloadUrl: '/reports/monthly-report.pdf' }
        },
        {
          id: `sys_${Date.now() + 1}`,
          type: 'warning' as const,
          title: 'Mantenimiento programado',
          message: 'El sistema tendrá mantenimiento el próximo domingo de 2:00 AM a 4:00 AM',
          timestamp: new Date(),
          read: false,
          userId: 'current_user',
          data: { maintenanceDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
        }
      ]

      const randomSystemNotif = systemNotifications[Math.floor(Math.random() * systemNotifications.length)]
      
      setTimeout(() => {
        const listeners = (socketClient as any).listeners.get('notification') || []
        listeners.forEach((callback: Function) => callback(randomSystemNotif))
      }, 100)

    }, 300000) // Every 5 minutes

    this.intervals.push(interval)
  }

  private simulateChatActivity() {
    const interval = setInterval(() => {
      if (!this.isRunning) return

      const chatMessages = [
        {
          id: `chat_${Date.now()}`,
          content: '¿Alguien puede revisar la aplicación de María García?',
          senderId: '2',
          senderName: 'Reclutador',
          senderRole: 'recruiter',
          timestamp: new Date(),
          chatRoomId: '1',
          messageType: 'text'
        },
        {
          id: `chat_${Date.now() + 1}`,
          content: 'Ya programé la entrevista con Carlos López para mañana',
          senderId: '3',
          senderName: 'María García',
          senderRole: 'manager',
          timestamp: new Date(),
          chatRoomId: '2',
          messageType: 'text'
        }
      ]

      const randomMessage = chatMessages[Math.floor(Math.random() * chatMessages.length)]
      
      setTimeout(() => {
        const listeners = (socketClient as any).listeners.get('chat_message') || []
        listeners.forEach((callback: Function) => callback(randomMessage))
      }, 100)

    }, 120000) // Every 2 minutes

    this.intervals.push(interval)
  }

  // Manual trigger methods for testing
  triggerSuccessNotification() {
    const notification = {
      id: `manual_${Date.now()}`,
      type: 'success' as const,
      title: 'Acción completada',
      message: 'La operación se ha completado exitosamente',
      timestamp: new Date(),
      read: false,
      userId: 'current_user',
      data: { manual: true }
    }

    setTimeout(() => {
      const listeners = (socketClient as any).listeners.get('notification') || []
      listeners.forEach((callback: Function) => callback(notification))
    }, 100)
  }

  triggerErrorNotification() {
    const notification = {
      id: `error_${Date.now()}`,
      type: 'error' as const,
      title: 'Error en el sistema',
      message: 'Se ha producido un error. Por favor, inténtalo de nuevo.',
      timestamp: new Date(),
      read: false,
      userId: 'current_user',
      data: { manual: true, errorCode: 'SIM_001' }
    }

    setTimeout(() => {
      const listeners = (socketClient as any).listeners.get('notification') || []
      listeners.forEach((callback: Function) => callback(notification))
    }, 100)
  }
}

export const notificationSimulator = new NotificationSimulator()
