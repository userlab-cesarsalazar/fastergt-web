import api from '../../config/api'
import { stage } from '../../config/credentials'

const url = stage.baseUrlPackages;
const transfer = params => api.put(url+'/transfer', params);

export default {
  transfer
}
