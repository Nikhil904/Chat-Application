import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { AuthStore } from "./UseAuthStore";
export const ChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const users = await axiosInstance.get("/message/users");
      console.log(users);
      set({ users: users.data.data });
    } catch (error) {
      console.log("Error while getting user list");
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const Message = await axiosInstance.get(`/message/${userId}`);
      set({ messages: Message.data.data });
    } catch (error) {
      console.log("Error while getting message list");
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessage: async () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = AuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  setSelectedUser: async (selectedUser) => set({ selectedUser }),
}));
