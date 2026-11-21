import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

import { getMyProduct } from "../../api/productApi";
import ProductStatusBadge from "../../components/products/ProductStatusBadge";

export default function LenderProductDetailsPage() {
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getMyProduct(productId);

                setProduct(response.data.product);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load product."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading product...
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="p-6">
                <p className="text-red-600">
                    {error || "Product not found."}
                </p>
            </div>
        );
    }

    const canEdit =
        product.approvalStatus !== "pending" &&
        product.approvalStatus !== "suspended" &&
        product.pendingUpdateStatus !== "pending";

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6">

            <div className="max-w-6xl mx-auto">

                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">

                    <Link
                        to="/lender/products"
                        className="flex items-center gap-2 text-accent"
                    >
                        <FaArrowLeft />
                        My products
                    </Link>

                    {canEdit && (
                        <Link
                            to={`/lender/products/${product._id}/edit`}
                            className="flex items-center gap-2 bg-accent text-white px-4 py-3 rounded-xl"
                        >
                            <FaEdit />
                            Edit product
                        </Link>
                    )}

                </div>

                <div className="bg-surface border border-border rounded-2xl p-5 sm:p-8">

                    <div className="flex flex-wrap items-center gap-3">

                        <h1 className="text-2xl sm:text-3xl font-bold">
                            {product.title}
                        </h1>

                        <ProductStatusBadge
                            status={product.approvalStatus}
                        />

                    </div>

                    <p className="text-muted mt-2">
                        Reference: {product.productId}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

                        <div>

                            <img
                                src={
                                    product.images?.[0] ||
                                    "/images/default-product.png"
                                }
                                alt={product.title}
                                className="w-full h-96 object-contain rounded-2xl bg-gray-50 border border-border"
                            />

                            {product.images?.length > 1 && (
                                <div className="grid grid-cols-3 gap-3 mt-4">

                                    {product.images.slice(1).map((image, index) => (
                                        <img
                                            key={`${image}-${index}`}
                                            src={image}
                                            alt={`${product.title} image ${index + 2}`}
                                            className="w-full h-24 object-cover rounded-xl border border-border"
                                        />
                                    ))}

                                </div>
                            )}

                        </div>

                        <div className="space-y-5">

                            <div>
                                <h2 className="font-semibold">
                                    Description
                                </h2>

                                <p className="text-muted mt-2 whitespace-pre-wrap">
                                    {product.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div className="p-4 rounded-xl bg-background">
                                    <p className="text-muted text-sm">
                                        Per day
                                    </p>

                                    <p className="font-bold mt-1">
                                        Rs. {Number(product.pricePerDay).toLocaleString()}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-background">
                                    <p className="text-muted text-sm">
                                        Deposit
                                    </p>

                                    <p className="font-bold mt-1">
                                        Rs. {Number(product.deposit || 0).toLocaleString()}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-background">
                                    <p className="text-muted text-sm">
                                        Category
                                    </p>

                                    <p className="font-bold mt-1">
                                        {product.category}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-background">
                                    <p className="text-muted text-sm">
                                        Condition
                                    </p>

                                    <p className="font-bold mt-1 capitalize">
                                        {product.condition}
                                    </p>
                                </div>

                            </div>

                            <div>
                                <h2 className="font-semibold">
                                    Location
                                </h2>

                                <p className="text-muted mt-2">
                                    {product.location?.city}
                                    {product.location?.district
                                        ? `, ${product.location.district}`
                                        : ""}
                                    {product.location?.country
                                        ? `, ${product.location.country}`
                                        : ""}
                                </p>
                            </div>

                            {/* Initial rejection reason */}
                            {product.rejectionReason && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">

                                    <h3 className="font-semibold text-red-700">
                                        Rejection reason
                                    </h3>

                                    <p className="text-red-700 mt-2">
                                        {product.rejectionReason}
                                    </p>

                                </div>
                            )}

                            {/* Proposed update status */}
                            {product.pendingUpdateStatus && (
                                <div className="p-4 bg-background border border-border rounded-xl">

                                    <h3 className="font-semibold">
                                        Update review status
                                    </h3>

                                    <p className="mt-2 capitalize">
                                        {product.pendingUpdateStatus}
                                    </p>

                                    {product.pendingUpdateRejectionReason && (
                                        <p className="text-red-700 mt-2">
                                            {product.pendingUpdateRejectionReason}
                                        </p>
                                    )}

                                </div>
                            )}

                            {/* Proposed changes */}
                            {product.pendingChanges && (
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">

                                    <h3 className="font-semibold text-amber-800">
                                        Changes awaiting approval
                                    </h3>

                                    <pre className="text-sm overflow-x-auto mt-3 whitespace-pre-wrap">
                                        {JSON.stringify(
                                            product.pendingChanges,
                                            null,
                                            2
                                        )}
                                    </pre>

                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}