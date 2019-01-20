import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'

// 使用请求拦截，它会将所有的请求拦截下来
axios.interceptors.request.use(function (config) {
  // config参数表示请求对象
  console.log(config)
  // 先从本地取token的值，判断到底有没有token值，如果有就往headers里面塞token，如果没有就直接return
  let mytoken = localStorage.getItem('mytoken') || ''
  if (mytoken) {
    // 存在token就将token塞进请求头的某个字段中，这个字段名不能随便取，它是一个前后端约定好的字段名
    config.headers['Authorization'] = mytoken
  }
  // 请求对象必须要return回去
  return config
}, function (error) {
  return Promise.reject(error)
})

// 登录接口处理
export const postLogin = obj => {
  return axios.post('/login', obj)
    .then(res => res.data)
}
// 首页 获取动态左侧
export const getMenus = () => axios.get('/menus').then(res => res.data)

// 用户数据列表
export const getUserList = obj => axios.get('/users', { params: obj })
  .then(res => res.data)
// 添加用户
export const addUser = obj => axios.post('/users', obj)
  .then(res => res.data)
// 删除用户
export const delUser = id => axios.delete(`/users/${id}`)
  .then(res => res.data)
// 编辑用户
export const editUser = obj => axios.put(`/users/${obj.id}`, { email: obj.email, mobile: obj.mobile }).then(res => res.data)
// 修改用户状态
export const changeState = (id, state) => axios.put(`/users/${id}/state/${state}`).then(res => res.data)
// 获取角色列表
export const getRoles = () => axios.get('/roles').then(res => res.data)
// 给用户分配角色
export const grantRole = (id, rid) => axios.put(`/users/${id}/role`, { rid: rid }).then(res => res.data)
// 获取所有的权限列表
export const getRights = type => axios.get(`/rights/${type}`).then(res => res.data)

// delUserRight 删除用户权限
export const delUserRight = (rightId, roleId) => axios.delete(`/roles/${roleId}/rights/${rightId}`).then(res => res.data)
// 添加角色 addRoles
export const addRoles = obj => axios.post(`/roles`, obj).then(res => res.data)
// 编辑角色 editRole
export const editRole = obj => axios.put(`/roles/${obj.id}`, { roleName: obj.roleName, roleDesc: obj.roleDesc }).then(res => res.data)
// 删除角色 、
export const delRole = (roleId) => axios.delete(`/roles/${roleId}`).then(res => res.data)
// grantUserRight 给角色分配权限
export const grantUserRight = (roleId, ridStrs) => axios.post(`/roles/${roleId}/rights`, { rids: ridStrs }).then(res => res.data)
// 获取商品列表
export const getProList = obj => axios.get('/goods', { params: obj })
  .then(res => res.data)
  // 获取分类列表

export const getCategories = (type, pagenum, pagesize) => axios.get('/categories', { params: { type: type, pagenum: pagenum, pagesize: pagesize } }).then(res => res.data)
// 添加分类
export const addCate = obj => axios.post('/categories', obj).then(res => res.data)
// 查询分类
export const getCate = cid => axios.get(`/categories/${cid}`).then(res =>
  res.data
)
// 获取2级分类的所有数据
export const getParentCate = params => {
  return axios.get('categories?type=2').then(res => res.data)
}
// 根据分类ID查询分类信息
export const getCateById = params => {
  return axios.get('/categories/' + params.id).then(res => res.data)
}
// 编辑提交表单
export const editCate = (id, obj) => {
  return axios.put(`/categories/${id}`, { cat_name: obj.cat_name }).then(res => res.data)
}
// categories/:id  删除表单
export const delCate = cid => {
  return axios.delete(`/categories/${cid}`).then(res => res.data)
}

// 获取3级分类列表
export const getCateList = params => {
  return axios.get('categories?type=3', params).then(res => res.data)
}
