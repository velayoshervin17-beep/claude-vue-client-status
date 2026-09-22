import axios from "axios";
import constant from "@/constant";

export interface Category {
  id: number;
  name: string;
  header: string;
}

export interface Item {
  id: number;
  name: string;
  deleted: boolean;
  categories?: Category[];
  pivot?: {
    category_id: number;
    item_id: number;
  };
}

interface ApiResponse<T> {
  data: T;
}

export interface PaginatedItemsResponse {
  current_page: number;
  data: Item[];
  per_page: number;
  total: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  links: unknown[];
}

export interface SaveItemPayload {
  name: string;
  category_ids: number[];
}

const clientStatusApi = axios.create({
  baseURL: constant.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchCategories() {
  const response =
    await clientStatusApi.get<ApiResponse<Category[]>>("/client-status");
  return response.data.data;
}

export async function fetchClientStatusItems(page = 1, perPage = 15) {
  const response = await clientStatusApi.get<PaginatedItemsResponse>(
    "/client-status/items",
    { params: { page, per_page: perPage } },
  );
  return response.data;
}

export async function createClientStatusItem(payload: SaveItemPayload) {
  const response = await clientStatusApi.post<ApiResponse<Item>>(
    "/client-status/items",
    payload,
  );
  return response.data.data;
}

export async function updateClientStatusItem(
  itemId: number,
  payload: SaveItemPayload,
) {
  const response = await clientStatusApi.patch<ApiResponse<Item>>(
    `/client-status/items/${itemId}`,
    payload,
  );
  return response.data.data;
}
