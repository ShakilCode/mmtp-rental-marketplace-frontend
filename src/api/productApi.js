import api from "./api";

// Public product endpoints
export const getPublicProducts = (params = {}) =>
    api.get("/products/public", { params });

export const getPublicProduct = (id) =>
    api.get(`/products/public/${id}`);

// Lender product endpoints
export const getMyProducts = () =>
    api.get("/products/my");

export const getMyProduct = (id) =>
    api.get(`/products/my/${id}`);

export const addProduct = (productData) =>
    api.post("/products/add", productData);

export const updateProduct = (id, productData) =>
    api.patch(`/products/${id}/update`, productData);

export const withdrawProduct = (id) =>
    api.delete(`/products/${id}`);

// Upload product images to Supabase through the backend
export const uploadProductImages = async (files) => {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("images", file);
    });

    const response = await api.post(
        "/products/upload-images",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data.images;
};

// Admin product endpoints
export const getPendingProducts = () =>
    api.get("/products/admin/pending");

export const getAdminProducts = (params = {}) =>
    api.get("/products/admin/all", { params });

export const getAdminProduct = (id) =>
    api.get(`/products/admin/${id}`);

export const reviewProduct = (id, reviewData) =>
    api.patch(`/products/admin/${id}/review`, reviewData);

export const adminUpdateProduct = (id, productData) =>
    api.patch(`/products/admin/${id}/update`, productData);

export const adminUpdateProductStatus = (id, statusData) =>
    api.patch(`/products/admin/${id}/status`, statusData);

export const adminDeleteProduct = (id, data = {}) =>
    api.delete(`/products/admin/${id}`, { data });

export const adminRestoreProduct = (id) =>
    api.patch(`/products/admin/${id}/restore`);