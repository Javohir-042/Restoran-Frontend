export const STAFF_API = {
  LIST: "/staff",
  CREATE: "/staff",
  BY_ID: (id: string) => `/staff/${id}`,
  CHANGE_PIN: (id: string) => `/staff/${id}/change-pin`,
  TOGGLE_ACTIVE: (id: string) => `/staff/${id}/toggle-active`,
  UPLOAD_AVATAR: (id: string) => `/staff/${id}/upload-avatar`,
};
