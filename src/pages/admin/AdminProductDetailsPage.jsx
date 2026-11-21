import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaEdit,
    FaSave,
    FaTimes,
} from "react-icons/fa";

import {
    getAdminProduct,
    adminUpdateProduct,
    adminUpdateProductStatus,
    adminDeleteProduct,
    adminRestoreProduct,
} from "../../api/productApi";

import ProductForm from "../../components/products/ProductForm";
import ProductStatusBadge from "../../components/products/ProductStatusBadge";

export default function AdminProductDetailsPage() {
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchProduct = async () => {
        setLoading(true);

        try {
            const response = await getAdminProduct(productId);

            setProduct(response.data.product);
            setError("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load product."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const handleEdit = async (data) => {
        setSaving(true);
        setError("");

        try {
            const response = await adminUpdateProduct(
                product._id,
                data
            );

            setProduct(response.data.product);
            setEditing(false);
            setMessage(response.data.message);
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

    const handleStatus = async (status) => {
        let reason = "";

        if (status === "rejected" || status === "suspended") {
            reason = window.prompt(
                `Enter reason for ${status}:`
            );

            if (!reason || !reason.trim()) return;
        }

        if (
            !window.confirm(
                `Change product status to ${status}?`
            )
        ) {
            return;
        }

        try {
            const response = await adminUpdateProductStatus(
                product._id,
                {
                    status,
                    reason,
                }
            );

            setProduct(response.data.product);
            setMessage(response.data.message);
            setError("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to change status."
            );
        }
    };

    const handleDelete = async () => {
        const reason = window.prompt(
            "Enter reason for deleting this product:"
        );

        if (reason === null) return;

        if (!window.confirm("Delete this product?")) return;

        try {
            const response = await adminDeleteProduct(
                product._id,
                { reason }
            );

            setMessage(response.data.message);

            await fetchProduct();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete product."
            );
        }
    };

    const handleRestore = async () => {
        if (!window.confirm("Restore this product?")) return;

        try {
            const response = await adminRestoreProduct(
                product._id
            );

            setProduct(response.data.product);
            setMessage(response.data.message);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to restore product."
            );
        }
    };

    if (loading) {
        return (
            <div className="text-center py-16">
                Loading product...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-6">
                {error || "Product not found."}
            </div>
        );
    }

    return (
        <div>

            <Link
                to="/admin/products"
                className="inline-flex items-center gap-2 text-accent mb-6"
            >
                <FaArrowLeft />
                Back to products
            </Link>

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

            {editing ? (
                <div className="border border-border rounded-2xl p-5 sm:p-8">

                    <div className="flex justify-between items-center mb-6">

                        <h1 className="text-2xl font-bold">
                            Edit product
                        </h1>

                        <button
                            onClick={() => setEditing(false)}
                            className="flex items-center gap-2 border border-border px-4 py-2 rounded-xl"
                        >
                            <FaTimes />
                            Cancel
                        </button>

                    </div>

                    <ProductForm
                        initialData={product}
                        onSubmit={handleEdit}
                        submitLabel="Save admin changes"
                        loading={saving}
                    />

                </div>
            ) : (
                <div className="border border-border rounded-2xl p-5 sm:p-8">

                    <div className="flex flex-wrap justify-between gap-4 items-center">

                        <div>

                            <h1 className="text-2xl font-bold">
                                {product.title}
                            </h1>

                            <p className="text-muted mt-2">
                                {product.productId}
                            </p>

                        </div>

                        <ProductStatusBadge
                            status={product.approvalStatus}
                        />

                    </div>

                    {product.isDeleted && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mt-5">
                            This product has been deleted.
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

                        <div>

                            <img
                                src={
                                    product.images?.[0] ||
                                    "/images/default-product.png"
                                }
                                alt={product.title}
                                className="w-full h-96 object-contain bg-gray-50 rounded-xl border border-border"
                            />

                            {product.images?.length > 1 && (
                                <div className="grid grid-cols-3 gap-3 mt-4">

                                    {product.images.slice(1).map((image, index) => (
                                        <img
                                            key={`${image}-${index}`}
                                            src={image}
                                            alt={`Product ${index + 2}`}
                                            className="w-full h-24 object-cover rounded-xl"
                                        />
                                    ))}

                                </div>
                            )}

                        </div>

                        <div className="space-y-5">

                            <div>
                                <h2 className="font-semibold">
                                    Product description
                                </h2>

                                <p className="text-muted mt-2 whitespace-pre-wrap">
                                    {product.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div className="p-4 bg-background rounded-xl">
                                    <p className="text-muted text-sm">
                                        Daily price
                                    </p>

                                    <p className="font-semibold mt-1">
                                        Rs. {Number(product.pricePerDay).toLocaleString()}
                                    </p>
                                </div>

                                <div className="p-4 bg-background rounded-xl">
                                    <p className="text-muted text-sm">
                                        Deposit
                                    </p>

                                    <p className="font-semibold mt-1">
                                        Rs. {Number(product.deposit || 0).toLocaleString()}
                                    </p>
                                </div>

                            </div>

                            <div>
                                <h2 className="font-semibold">
                                    Owner information
                                </h2>

                                <div className="p-4 bg-background rounded-xl mt-2">

                                    <p>
                                        {product.owner?.firstName}{" "}
                                        {product.owner?.lastName}
                                    </p>

                                    <p className="text-muted text-sm mt-1">
                                        {product.owner?.email}
                                    </p>

                                    <p className="text-muted text-sm mt-1">
                                        {product.owner?.phone || "No phone"}
                                    </p>

                                    <p className="text-sm mt-2">
                                        Role: {product.owner?.role}
                                    </p>

                                    <p className="text-sm mt-1">
                                        Account: {product.owner?.isBlocked
                                            ? "Blocked"
                                            : "Active"}
                                    </p>

                                </div>
                            </div>

                            {product.pendingChanges && (
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">

                                    <h2 className="font-semibold">
                                        Pending update
                                    </h2>

                                    <pre className="text-sm mt-3 overflow-x-auto whitespace-pre-wrap">
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

                    {/* Moderation history */}
                    <section className="mt-10">

                        <h2 className="text-xl font-semibold">
                            Moderation history
                        </h2>

                        {product.moderationHistory?.length ? (
                            <div className="space-y-3 mt-4">

                                {product.moderationHistory
                                    .slice()
                                    .reverse()
                                    .map((history, index) => (
                                        <div
                                            key={index}
                                            className="border border-border p-4 rounded-xl"
                                        >

                                            <p className="font-medium">
                                                {history.action}
                                            </p>

                                            <p className="text-sm text-muted mt-1">
                                                {history.note}
                                            </p>

                                            {history.rejectionReason && (
                                                <p className="text-sm text-red-700 mt-2">
                                                    Reason: {history.rejectionReason}
                                                </p>
                                            )}

                                            {history.changes && (
                                                <details className="mt-3">

                                                    <summary className="cursor-pointer text-sm text-accent">
                                                        View recorded changes
                                                    </summary>

                                                    <pre className="text-xs mt-2 whitespace-pre-wrap overflow-x-auto">
                                                        {JSON.stringify(
                                                            history.changes,
                                                            null,
                                                            2
                                                        )}
                                                    </pre>

                                                </details>
                                            )}

                                            <p className="text-xs text-muted mt-2">
                                                {history.at
                                                    ? new Date(history.at).toLocaleString()
                                                    : ""}
                                            </p>

                                        </div>
                                    ))}

                            </div>
                        ) : (
                            <p className="text-muted mt-3">
                                No moderation history available.
                            </p>
                        )}

                    </section>

                    {/* Admin controls */}
                    <section className="mt-10 border-t border-border pt-6">

                        <h2 className="text-lg font-semibold">
                            Administrator actions
                        </h2>

                        <div className="flex flex-wrap gap-3 mt-4">

                            {!product.isDeleted && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="flex items-center gap-2 px-4 py-3 bg-accent text-white rounded-xl"
                                >
                                    <FaEdit />
                                    Direct edit
                                </button>
                            )}

                            {!product.isDeleted &&
                                product.approvalStatus !== "pending" &&
                                product.approvalStatus !== "approved" && (
                                    <button
                                        onClick={() => handleStatus("approved")}
                                        className="px-4 py-3 bg-green-600 text-white rounded-xl"
                                    >
                                        Approve / Reapprove
                                    </button>
                            )}

                            {!product.isDeleted &&
                                product.approvalStatus !== "suspended" && (
                                    <button
                                        onClick={() => handleStatus("suspended")}
                                        className="px-4 py-3 bg-gray-700 text-white rounded-xl"
                                    >
                                        Suspend
                                    </button>
                            )}

                            {!product.isDeleted &&
                                product.approvalStatus !== "rejected" &&
                                product.approvalStatus !== "pending" && (
                                    <button
                                        onClick={() => handleStatus("rejected")}
                                        className="px-4 py-3 bg-red-600 text-white rounded-xl"
                                    >
                                        Reject
                                    </button>
                            )}

                            {product.isDeleted ? (
                                <button
                                    onClick={handleRestore}
                                    className="px-4 py-3 bg-green-600 text-white rounded-xl"
                                >
                                    Restore product
                                </button>
                            ) : (
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-3 border border-red-300 text-red-700 rounded-xl"
                                >
                                    Delete product
                                </button>
                            )}

                        </div>

                    </section>

                </div>
            )}

        </div>
    );
}