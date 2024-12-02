import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const AuthStore = create((set) => ({
  //initial Value
  authUser: null,
  isSignedIn: false,
  isLogined: false,
  isUpdateProfile: false,
  isCheckingAuth: true,
  OnlineUsers:[],

  //defining the function

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (err) {
      console.log("Error", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({isSignedIn: true})
    try {
      let res = await axiosInstance.post("/auth/signup", data);
      toast.success("Account Created Successfully");
      set({ authUser: res.data });
    } catch (error) {
      toast.error("Something went wrong!!!");
    } finally {
      set({ isSignedIn: false });
    }
  },

  login: async (data) => {
    set({isLogined:true})
    try {
      let res = await axiosInstance.post("/auth/login", data);
      toast.success("Login Successfully");
      set({ authUser: res.data });
    } catch (error) {
      toast.error("Something went wrong!!!");
    } finally {
      set({ isLogined: false });
    }
  },

  logout: async () => {
    try {
        await axiosInstance.post("/auth/logout")
        set({authUser: null})
        toast.success("Logout Successfully");
    } catch (error) {
        console.log("Something Went Wrong")
    }
  },

  updateProfile: async (data) => {
    set({isUpdateProfile:true})
    try{
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({authUser: res.data})
      toast.success("Profile Updated Successfully")
    }catch (error) {
      console.log("Error while updating profile")
      toast.error(error.response.data.message)
    }
    finally{
      set({isUpdateProfile:false})
    }
  }
}));
