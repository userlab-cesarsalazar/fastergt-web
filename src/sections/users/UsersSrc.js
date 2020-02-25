import api from '../../config/api'
import { stage } from '../../config/credentials'

const url = stage.baseUrlUsers;

const list = (params) => api.get(`${url}${params ? `?${params}` : ''}`);
const get = (user_id) => api.get(url+'/'+user_id);
const create = _users => api.post(url, _users);
const update = (_users,user_id) => api.put(url+'/'+user_id, _users);

export default {
  list,
  create,
  update,
  get
}
