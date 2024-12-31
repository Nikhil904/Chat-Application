import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/Socket.js";
export const getAllUserList = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    //find the list of users
    let userList = await User.find({ _id: { $ne: loggedUserId } }).select(
      "-password"
    );
    res
      .status(200)
      .json({ message: "User List get Successfully", data: userList });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    //receiver ID
    const { id } = req.params;
    const myId = req.user._id;
    const message = await Message.find({
      //sender is me and receiver is other user and vice versa
      $or: [
        { senderId: myId, receiverId: id },
        { senderId: id, receiverId: myId },
      ],
    });
    res.status(200).json({ message: "Get All Messages", data: message });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    //implement the socket.io
    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId){
      //this event is send the event for the specific receiver
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }
    res
      .status(201)
      .json({ messgae: "Message Send Successfully", data: newMessage });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
