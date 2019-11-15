enum UserRole {
  USER = 'ROLE_USER',
  STUFF = 'ROLE_STUFF',
  ADMIN = 'ROLE_ADMIN',
}

interface UserQuery {
  id?: string
  groupid?: string
  username?: string
  name?: string
  studentNumber?: string
  temporary?: boolean
  school?: string
  role?: UserRole[]
}

export { UserQuery, UserRole }
