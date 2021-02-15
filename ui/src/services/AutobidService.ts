import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8081/api/";

class AutobidService {
  createAutobid({ item_id, user }) {
    return axios.post(`${API_URL}autobids`, { item_id, user }, { headers: authHeader() });
  }
  deleteAutobid(id: string) {
    return axios.delete(`${API_URL}autobids/${id}`, { headers: authHeader() });
  }
  getAutobidConfig(user: string) {
    return axios.get(`${API_URL}autobidConfigs/${user}`, { headers: authHeader() });
  }
  upsertAutobidConfig(user: string, max_amount: string) {
    return axios.post(`${API_URL}autobidConfigs/${user}`, { max_amount }, { headers: authHeader() });
  }
}

export default new AutobidService();
