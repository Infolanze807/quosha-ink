import axiosConfig from "../../app/axiosConfig";

const addReview = async (reviewData: {
  productId: string;
  userId: string;
  orderId: string;
  name: string;
  rating: number;
  comment: string;
}) => {
  try {
    const response = await axiosConfig.post("/reviewrating/add", reviewData);
    return response.data.review;
  } catch (error) {
    throw new Error("Failed to add review");
  }
};

const getReview = async (productId: string, userId: string, orderId: string) => {
  try {
    // const response = await axiosConfig.get(`/reviewrating/348594860/667bb180fd61851d1422b254/107789127`);
    const response = await axiosConfig.get(`/reviewrating/${productId}/${userId}/${orderId}`);
    // console.log("Manish", response)
    return response.data.review;
  } catch (error) {
    throw new Error("Failed to fetch review");
  }
};

const getReviews = async (productId: string) => {
  try {
    const response = await axiosConfig.get(`/reviewrating/${productId}`);
    return response.data.reviews;
  } catch (error) { // Debug log
    throw new Error("Failed to fetch reviews");
  }
};

const updateReview = async (reviewId: string, reviewData: { userId: string; rating: number; comment: string }) => {
  try {
    const response = await axiosConfig.put(`/reviewrating/update/${reviewId}`, reviewData);
    return response.data.review;
  } catch (error) {
    throw new Error("Failed to update review");
  }
};

const deleteReview = async (reviewId: string, userId: string) => {
  try {
    const response = await axiosConfig.delete(`/reviewrating/delete/${reviewId}`, { data: { userId } });
    return response.data.message;
  } catch (error) {
    throw new Error("Failed to delete review");
  }
};

const reviewService = {
  addReview,
  getReview,
  getReviews,
  updateReview,
  deleteReview,
};

export default reviewService;