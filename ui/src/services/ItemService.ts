import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8081/api/";

class ItemService {
  getItemList(page: number, limit: number) {
    let url = `${API_URL}items`;
    if (page && limit) {
      url += `?page=${page}&limit=${limit}`;
    }
    return axios.get(url, { headers: authHeader() });
  }
  getItemCount() {
    return axios.get(`${API_URL}items/count`, { headers: authHeader() });
  }
  getItemDetails(id: string) {
    return axios.get(`${API_URL}items/${id}`, { headers: authHeader() });
  }
  bid(bidInfo: any) {
    return axios.post(`${API_URL}bids`, bidInfo, { headers: authHeader() });
  }
  getBids(itemId: string) {
    return axios.get(`${API_URL}bids/${itemId}`, { headers: authHeader() });
  }
}

export default new ItemService();
