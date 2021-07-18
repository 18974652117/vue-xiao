import instance from './config'

// 登录
export async function getLogin (username, password) {
  return await instance.post('/login', { username, password })
}

// 获取左侧菜单 menus
export async function getMenusList () {
  return await instance.get('/menus')
}

// 获取用户列表数据 users
export async function getUserLists (query = '', pagenum = 1, pagesize = 2) {
  return await instance.get(`/users?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`)
}

// 开关 状态的改变 users/:uId/state/:type    这个接口有问题
export async function getSwitchState (uId, state, type) {
  return await instance.put('/users', { uId, state, type })
}

// 添加用户请求 users
export async function getAddUsers (username, password, email, mobile) {
  return await instance.post('/users', { username, password, email, mobile })
}

// 查询用户信息 users/:id
export async function getEditUser (id) {
  return await instance.get(`/users/${id}`)
}

// 编辑用户：users/:id    这个接口有问题
export async function getEditUserInfo (id, email, mobile) {
  return await instance.put(`/users/${id}`, { email, mobile })
}

// 删除单个用户：users/:id
export async function getDelUserInfo (id) {
  return await instance.delete(`/users/${id}`)
}

// 所有权限列表 rights/:type
export async function getRightsList (list) {
  return await instance.get('/rights/list')
}

// 角色列表 roles
export async function getRolesList () {
  return await instance.get('/roles')
}

// 删除角色指定权限 一 二 三级权限 roles/:roleId/rights/:rightId    这个借口有问题  角色列表页
export async function getDelRight (role, rightId) {
  return await instance.delete(`/roles/${role.id}/rights/${rightId}`)
}

// 基于时间统计的折线图  /reports/type/1
export async function getEchrats () {
  return await instance.get('/reports/type/1')
}

// 商品分类列表 categories
export async function getCategories (type = '3', pagenum = '1', pagesize = '5') {
  return await instance.get(`/categories?type=${type}&pagenum=${pagenum}&pagesize=${pagesize}`)
}

// 获取父级分类列表 请求路径：categories
export async function getFatherCassifyList (cat_pid, cat_name, cat_level) {
  return await instance.post('/categories', { cat_pid, cat_name, cat_level })
}
