import axiosConfig from "../../app/axiosConfig";

interface WishlistItem {
  userId: string;
  productId: number;
  // Add other properties if necessary
}
const addToWishlist = async (wishlistItem:WishlistItem) => {
  const response = await axiosConfig.post("wishlist/add", wishlistItem);
  return response.data;
};

const removeItemFromWishlist = async ({ userId, productId }:WishlistItem) => {
  try {
    const response = await axiosConfig.delete("wishlist/remove", { data: { userId, productId } });
    // console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
    throw error;
  }
};

const getUserWishlist = async (userId:string) => {
  const response = await axiosConfig.get(`wishlist/${userId}`);
  return response.data;
};

const wishlistService = {
  addToWishlist,
  removeItemFromWishlist,
  getUserWishlist,
};

export default wishlistService;
