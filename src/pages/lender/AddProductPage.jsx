
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import {
    addProduct,
    uploadProductImages,
} from "../../api/productApi";

import ProductForm from "../../components/products/ProductForm";

export default function AddProductPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (productData) => {
        setLoading(true);
        setError("");

        try {
            await addProduct(productData);

            navigate("/lender/products", {
                state: {
                    message: "Product submitted for approval.",
                },
            });
        } catch (err) {
            setError(
                err.response?.data?.errors?.join(", ") ||
                err.response?.data?.message ||
                "Failed to submit product."
            );

            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6">

            <div className="max-w-4xl mx-auto">

                <Link
                    to="/lender/products"
                    className="inline-flex items-center gap-2 text-accent mb-6"
                >
                    <FaArrowLeft />
                    Back to my products
                </Link>

                <div className="bg-surface border border-border rounded-2xl p-5 sm:p-8">

                    <h1 className="text-2xl font-bold">
                        Add a product
                    </h1>

                    <p className="text-muted mt-2 mb-8">
                        Submit your product for administrator review.
                        It will not become publicly visible until approved.
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-5">
                            {error}
                        </div>
                    )}

                    <ProductForm
                        onSubmit={handleSubmit}
                        uploadImages={uploadProductImages}
                        submitLabel="Submit for approval"
                        loading={loading}
                    />

                </div>

            </div>

        </div>
    );
}
