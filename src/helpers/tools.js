import db from '../../db/models'

export const addRoleToUser = (user, roleName = 'regular') => db.Role.findOne({where: {name: roleName}}).then(role => ({...user, role_id: role.id}))

export const isAdmin = async roleId => {
    const role = await db.Role.findByPk(roleId)
  
    return role.name === 'admin'
}

export const pagination = (page = {size: 15, number: 1}) => ({
    limit: parseInt(page.size), offset: parseInt(page.size) * (parseInt(page.number) - 1)
})

export const totalPage = (count, size = 15) => Math.ceil(count / size)

export const tokenPayload = ({id, name, email, role_id}) => ({id, name, email, role_id})

export const formatRecord = record => record.get({plain: true})

export const sanitizeUserAttributes = ({id, name, email, role_id, Role = {}}) => ({
    id,
    email,
    name,
    role_id,
    roleName: Role.name
  })
