import axiosInstance from "../config/axiosConfig"; // Use the configured Axios instance
import { AxiosResponse } from "axios";
import { Item } from "../types/Item";

// Service functions for inventory management
const inventoryService = {
  /**
   * Fetch all items.
   * @returns {Promise<Item[]>} A promise that resolves to the list of items.
   */
  getItems: async (): Promise<Item[]> => {
    try {
      const response: AxiosResponse<Item[]> = await axiosInstance.get("/items");
      return response.data;
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    }
  },

  /**
   * Fetch a single item by ID.
   * @param {number} id - The ID of the item to fetch.
   * @returns {Promise<Item>} A promise that resolves to the item.
   */
  getItem: async (id: number): Promise<Item> => {
    try {
      const response: AxiosResponse<Item> = await axiosInstance.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching item with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Add a new item.
   * @param {Item} item - The item to add.
   * @returns {Promise<Item>} A promise that resolves to the added item.
   */
  addItem: async (item: Item): Promise<Item> => {
    try {
      const response: AxiosResponse<Item> = await axiosInstance.post("/addItem", item);
      return response.data;
    } catch (error) {
      console.error("Error adding item:", error);
      throw error;
    }
  },

  /**
   * Add multiple items.
   * @param {Item[]} items - The list of items to add.
   * @returns {Promise<Item[]>} A promise that resolves to the added items.
   */
  addItems: async (items: Item[]): Promise<Item[]> => {
    try {
      const response: AxiosResponse<Item[]> = await axiosInstance.post("/addItems", items);
      return response.data;
    } catch (error) {
      console.error("Error adding multiple items:", error);
      throw error;
    }
  },

  /**
   * Update an existing item by ID.
   * @param {number} id - The ID of the item to update.
   * @param {Item} itemDetails - The updated item details.
   * @returns {Promise<Item>} A promise that resolves to the updated item.
   */
  updateItem: async (id: number, itemDetails: Item): Promise<Item> => {
    try {
      const response: AxiosResponse<Item> = await axiosInstance.put(
        `/updateItems/${id}`,
        itemDetails
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating item with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete multiple items by IDs.
   * @param {number[]} ids - The list of item IDs to delete.
   * @returns {Promise<void>} A promise that resolves when the items are deleted.
   */
  deleteItems: async (ids: number[]): Promise<void> => {
    try {
      await axiosInstance.delete("/deleteItems", { data: ids });
    } catch (error) {
      console.error("Error deleting items:", error);
      throw error;
    }
  },
};

export default inventoryService;
