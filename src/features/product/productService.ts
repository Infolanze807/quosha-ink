import axiosConfig from "../../app/axiosConfig";

const getProducts = async () => {
  const response = await axiosConfig.get("printful/store/products");

  console.log("response", response.data)

  return response.data;
};

const getSingleProduct = async (id: number) => {
  const response = await axiosConfig.get(`printful/store/products/${id}`);
  // console.log("This is single product response", response.data.result.sync_product.thumbnail_url)
  return response.data.result;
};

const getSizeChart = async (productId: number) => {
  const response = await axiosConfig.get(`/printful/products/${productId}/sizes`);
  return response.data.result;
};


const productService = {
  getProducts,
  getSingleProduct,
  getSizeChart,
};

export default productService;
