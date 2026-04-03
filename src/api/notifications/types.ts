/**
 * GET /api/v1/notifications 쿼리
 */
export interface GetNotificationsParams {
  page?: number;
  limit?: number;
}

export type NotificationType =
  | 'APPLICATION_RECEIVED'
  | 'APPLICATION_ACCEPTED'
  | 'APPLICATION_REJECTED'
  | 'PENALTY_WARNING'
  | 'GATHERING_STARTED'
  | 'GATHERING_ENDED'
  | 'REVIEW_REQUEST'
  | 'POKE';

/** 알림 한 건 */
export interface NotificationItem {
  id: number;
  type: NotificationType;
  content: string;
  isRead: boolean;
  targetUrl: string;
  createdAt: string;
}

/**
 * GET /api/v1/notifications 응답
 */
export interface GetNotificationsResponse {
  notifications: NotificationItem[];
  unreadCount: number;
}

/**
 * PATCH /api/v1/notifications/:notificationId/read
 * PATCH /api/v1/notifications/read-all
 */
export interface PatchNotificationReadResponse {
  success: boolean;
}
