
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import {
    getMyProduct,
    updateProduct,
    uploadProductImages,
} from "../../api/productApi";

import ProductForm from "../../components/products/ProductForm";

export default function EditProductPage() {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getMyProduct(productId);

                setProduct(response.data.product);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to retrieve product."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleSubmit = async (productData) => {
        setSaving(true);
        setError("");

        try {
            const response = await updateProduct(
                productId,
                productData
            );

            navigate("/lender/products", {
                state: {
                    message: response.data.message,
                },
            });
        } catch (err) {
            setError(
                err.response?.data?.errors?.join(", ") ||
                err.response?.data?.message ||
                "Unable to update product."
            );

            throw err;
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading product...
            </div>
        );
    }

    if (error && !product) {
        return (
            <div className="p-6">
                <p className="text-red-600">{error}</p>

                <Link
                    to="/lender/products"
                    className="text-accent mt-4 inline-block"
                >
                    Back to my products
                </Link>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6">

            <div className="max-w-4xl mx-auto">

                <Link
                    to={`/lender/products/${product._id}`}
                    className="inline-flex items-center gap-2 text-accent mb-6"
                >
                    <FaArrowLeft />
                    Back to product
                </Link>

                <div className="bg-surface border border-border rounded-2xl p-5 sm:p-8">

                    <h1 className="text-2xl font-bold">
                        Edit product
                    </h1>

                    <p className="text-muted mt-2 mb-8">
                        {product.approvalStatus === "rejected"
                            ? "Correct the rejected product and resubmit it for approval."
                            : "Changes to an approved listing will require administrator approval. Your original listing will remain active while the changes are reviewed."}
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-5">
                            {error}
                        </div>
                    )}

                    <ProductForm
                        initialData={product}
                        onSubmit={handleSubmit}
                        uploadImages={uploadProductImages}
                        submitLabel={
                            product.approvalStatus === "rejected"
                                ? "Resubmit product"
                                : "Submit changes for review"
                        }
                        loading={saving}
                    />

                </div>

            </div>

        </div>
    );
}
