import { useEffect, useState } from "react";
import {
    FaCheck,
    FaTimes,
    FaSync,
    FaEye,
} from "react-icons/fa";

import {
    getPendingProducts,
    reviewProduct,
} from "../../api/productApi";

import ProductStatusBadge from "../../components/products/ProductStatusBadge";

export default function PendingProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchPending = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getPendingProducts();

            setProducts(response.data.products || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to retrieve pending reviews."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (product) => {
        const isUpdate = product.reviewType === "product_update";

        const confirmed = window.confirm(
            isUpdate
                ? `Approve the proposed changes to "${product.title}"?`
                : `Approve "${product.title}" and publish it?`
        );

        if (!confirmed) return;

        setProcessingId(product._id);
        setError("");
        setMessage("");

        try {
            const response = await reviewProduct(product._id, {
                status: "approved",
                note: isUpdate
                    ? "Product update reviewed and approved."
                    : "New product reviewed and approved.",
            });

            setMessage(response.data.message);

            await fetchPending();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to approve product."
            );
        } finally {
            setProcessingId("");
        }
    };

    const handleReject = async (product) => {
        const reason = window.prompt(
            "Please enter the rejection reason:"
        );

        if (!reason || !reason.trim()) {
            return;
        }

        const isUpdate = product.reviewType === "product_update";

        setProcessingId(product._id);
        setError("");
        setMessage("");

        try {
            const response = await reviewProduct(product._id, {
                status: "rejected",
                rejectionReason: reason.trim(),
                note: isUpdate
                    ? "Proposed product update rejected."
                    : "New product submission rejected.",
            });

            setMessage(response.data.message);

            await fetchPending();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to reject product."
            );
        } finally {
            setProcessingId("");
        }
    };

    const renderValue = (value) => {
        if (
            value &&
            typeof value === "object"
        ) {
            return JSON.stringify(value, null, 2);
        }

        if (value === null || value === undefined) {
            return "Not provided";
        }

        return String(value);
    };

    return (
        <div>

            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">

                <div>
                    <h1 className="text-2xl font-bold">
                        Pending Product Reviews
                    </h1>

                    <p className="text-muted mt-2">
                        Review new listings and proposed product changes.
                    </p>
                </div>

                <button
                    onClick={fetchPending}
                    className="flex items-center gap-2 px-4 py-3 border border-border rounded-xl"
                >
                    <FaSync />
                    Refresh
                </button>

            </div>

            {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-4">
                    {message}
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-16">
                    Loading pending reviews...
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-16 border border-border rounded-2xl">

                    <h2 className="font-semibold text-lg">
                        No pending reviews
                    </h2>

                    <p className="text-muted mt-2">
                        All product submissions have been reviewed.
                    </p>

                </div>
            ) : (
                <div className="space-y-5">

                    {products.map((product) => {
                        const isUpdate =
                            product.reviewType === "product_update";

                        const proposedChanges =
                            product.proposedChanges || {};

                        return (
                            <article
                                key={product._id}
                                className="border border-border rounded-2xl overflow-hidden"
                            >

                                {/* Review type */}
                                <div className="bg-background border-b border-border p-4 flex flex-wrap justify-between items-center gap-3">

                                    <div className="flex flex-wrap items-center gap-3">

                                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                            isUpdate
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-amber-100 text-amber-800"
                                        }`}>
                                            {isUpdate
                                                ? "Product update"
                                                : "New submission"}
                                        </span>

                                        <ProductStatusBadge
                                            status={product.approvalStatus}
                                        />

                                    </div>

                                    <span className="text-sm text-muted">
                                        {product.productId}
                                    </span>

                                </div>

                                <div className="p-4 sm:p-6">

                                    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">

                                        {/* Image */}
                                        <div>

                                            <img
                                                src={
                                                    product.images?.[0] ||
                                                    "/images/default-product.png"
                                                }
                                                alt={product.title}
                                                className="w-full h-52 object-cover rounded-xl bg-gray-100"
                                                onError={(event) => {
                                                    event.currentTarget.src =
                                                        "/images/default-product.png";
                                                }}
                                            />

                                        </div>

                                        {/* Product information */}
                                        <div>

                                            <h2 className="text-xl font-bold">
                                                {product.title}
                                            </h2>

                                            <p className="text-muted mt-2">
                                                {product.category}
                                            </p>

                                            <p className="text-muted text-sm mt-2">
                                                {product.location?.city}
                                                {product.location?.district
                                                    ? `, ${product.location.district}`
                                                    : ""}
                                            </p>

                                            <p className="font-semibold mt-3">
                                                Rs. {Number(product.pricePerDay).toLocaleString()} / day
                                            </p>

                                            <p className="text-muted mt-3 whitespace-pre-wrap">
                                                {product.description}
                                            </p>

                                            {/* Owner */}
                                            <div className="mt-5 p-4 bg-background border border-border rounded-xl">

                                                <h3 className="font-semibold">
                                                    Product owner
                                                </h3>

                                                <p className="text-sm mt-2">
                                                    {product.owner?.firstName}{" "}
                                                    {product.owner?.lastName}
                                                </p>

                                                <p className="text-sm text-muted mt-1">
                                                    {product.owner?.email}
                                                </p>

                                                <p className="text-sm text-muted mt-1">
                                                    {product.owner?.phone || "Phone not provided"}
                                                </p>

                                                <p className="text-xs text-muted mt-2">
                                                    Owner role: {product.owner?.role}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    {/* Proposed changes */}
                                    {isUpdate && (
                                        <section className="mt-6">

                                            <h3 className="text-lg font-semibold">
                                                Proposed changes
                                            </h3>

                                            <p className="text-muted text-sm mt-1">
                                                The existing approved listing remains unchanged until you approve these changes.
                                            </p>

                                            <div className="mt-4 border border-border rounded-xl overflow-hidden">

                                                {Object.entries(proposedChanges).map(
                                                    ([field, value]) => (
                                                        <div
                                                            key={field}
                                                            className="grid grid-cols-1 md:grid-cols-[180px_1fr] border-b border-border last:border-b-0"
                                                        >

                                                            <div className="bg-background p-3 font-medium capitalize">
                                                                {field}
                                                            </div>

                                                            <div className="p-3 text-sm whitespace-pre-wrap break-words">
                                                                {renderValue(value)}
                                                            </div>

                                                        </div>
                                                    )
                                                )}

                                            </div>

                                        </section>
                                    )}

                                    {/* Initial rejection history */}
                                    {product.rejectionReason && (
                                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">

                                            <h3 className="font-semibold text-red-700">
                                                Previous rejection reason
                                            </h3>

                                            <p className="text-red-700 text-sm mt-2">
                                                {product.rejectionReason}
                                            </p>

                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-3 mt-6">

                                        <button
                                            onClick={() => handleApprove(product)}
                                            disabled={processingId === product._id}
                                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white disabled:opacity-50"
                                        >
                                            <FaCheck />

                                            {processingId === product._id
                                                ? "Processing..."
                                                : isUpdate
                                                    ? "Approve changes"
                                                    : "Approve product"}
                                        </button>

                                        <button
                                            onClick={() => handleReject(product)}
                                            disabled={processingId === product._id}
                                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white disabled:opacity-50"
                                        >
                                            <FaTimes />
                                            Reject
                                        </button>

                                    </div>

                                </div>

                            </article>
                        );
                    })}

                </div>
            )}

        </div>
    );
}