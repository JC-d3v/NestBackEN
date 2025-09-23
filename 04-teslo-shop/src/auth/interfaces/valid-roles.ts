


export const VALID_ROLES = {
  admin: 'ADMIN',
  superUser: 'SUPER',
  user: 'USER'
} as const;

export type ValidRoles = (typeof VALID_ROLES)[keyof typeof VALID_ROLES];