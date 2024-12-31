import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const AuthStore = create((set, get) => ({
  //initial Value
  authUser: null,
  isSignedIn: false,
  isLogined: false,
  isUpdateProfile: false,
  isCheckingAuth: true,
  OnlineUsers: [],
  socket: null,

  //defining the function

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (err) {
      console.log("Error", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSignedIn: true });
    try {
      let res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account Created Successfully");
      get().connectSocket();
    } catch (error) {
      toast.error("Something went wrong!!!");
    } finally {
      set({ isSignedIn: false });
    }
  },

  login: async (data) => {
    set({ isLogined: true });
    try {
      let res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login Successfully");
      get().connectSocket();
    } catch (error) {
      toast.error("Something went wrong!!!");
    } finally {
      set({ isLogined: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout Successfully");
      get().disconnectSocket();
    } catch (error) {
      console.log("Something Went Wrong");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdateProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.log("Error while updating profile");
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdateProfile: false });
    }
  },

  connectSocket: async () => {
    let { authUser } = get();
    if (!authUser || get()?.socket?.connected) return;

    const socket = io(BASE_URL,{
      query:{
        userId:authUser._id
      }
    });
    socket.connect();
    set({ socket: socket });

    //socket.on method id used for the listen the event
    socket.on("getOnlineUser",(userIds) => {
      set({OnlineUsers:userIds})
    })
  },

  disconnectSocket: () => {
    if (get()?.socket?.connected) {
      console.log(get().socket);
      get().socket.disconnect();
    }
  },
}));
