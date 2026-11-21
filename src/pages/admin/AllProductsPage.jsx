import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaEye,
    FaSync,
    FaTrash,
    FaUndo,
} from "react-icons/fa";

import {
    getAdminProducts,
    adminUpdateProductStatus,
    adminDeleteProduct,
    adminRestoreProduct,
} from "../../api/productApi";

import ProductStatusBadge from "../../components/products/ProductStatusBadge";

export default function AllProductsPage({ initialStatus = "" }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState(initialStatus);
    const [includeDeleted, setIncludeDeleted] = useState(false);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const fetchProducts = async (pageNumber = page) => {
        setLoading(true);
        setError("");

        try {
            const response = await getAdminProducts({
                search: search.trim() || undefined,
                status: status || undefined,
                includeDeleted: includeDeleted ? "true" : "false",
                page: pageNumber,
                limit: 20,
            });

            setProducts(response.data.products || []);
            setPages(response.data.pages || 1);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to retrieve products."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(1);
    }, [status, includeDeleted, page]);

    const handleSearch = (event) => {
        event.preventDefault();
        setPage(1);
        fetchProducts(1);
    };

    const handleStatusChange = async (product, nextStatus) => {
        let reason = "";

        if (["rejected", "suspended"].includes(nextStatus)) {
            reason = window.prompt(
                `Reason for ${nextStatus}:`
            );

            if (!reason || !reason.trim()) {
                return;
            }
        }

        const confirmed = window.confirm(
            `Change "${product.title}" status to ${nextStatus}?`
        );

        if (!confirmed) return;

        setError("");
        setMessage("");

        try {
            const response = await adminUpdateProductStatus(
                product._id,
                {
                    status: nextStatus,
                    reason: reason.trim(),
                }
            );

            setMessage(response.data.message);

            await fetchProducts();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update product status."
            );
        }
    };

    const handleDelete = async (product) => {
        const reason = window.prompt(
            "Reason for removing this product:"
        );

        if (reason === null) return;

        const confirmed = window.confirm(
            `Remove "${product.title}"?`
        );

        if (!confirmed) return;

        try {
            await adminDeleteProduct(product._id, {
                reason: reason.trim(),
            });

            setMessage("Product removed successfully.");

            await fetchProducts();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to remove product."
            );
        }
    };

    const handleRestore = async (product) => {
        if (
            !window.confirm(
                `Restore "${product.title}"?`
            )
        ) {
            return;
        }

        try {
            await adminRestoreProduct(product._id);

            setMessage("Product restored successfully.");

            await fetchProducts();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to restore product."
            );
        }
    };

    return (
        <div>

            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">

                <div>
                    <h1 className="text-2xl font-bold">
                        All Products
                    </h1>

                    <p className="text-muted mt-2">
                        Search and manage marketplace listings.
                    </p>
                </div>

                <button
                    onClick={() => fetchProducts()}
                    className="flex items-center gap-2 border border-border px-4 py-3 rounded-xl"
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

            <form
                onSubmit={handleSearch}
                className="bg-background border border-border p-4 rounded-xl mb-5 flex flex-wrap gap-3"
            >

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search title, product ID, category or city"
                    className="flex-1 min-w-[220px] px-4 py-3 rounded-xl border border-border bg-surface"
                />

                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(1);
                    }}
                    className="px-4 py-3 rounded-xl border border-border bg-surface"
                >
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                </select>

                <label className="flex items-center gap-2 px-3">
                    <input
                        type="checkbox"
                        checked={includeDeleted}
                        onChange={(e) => {
                            setIncludeDeleted(e.target.checked);
                            setPage(1);
                        }}
                    />

                    <span className="text-sm">
                        Include deleted
                    </span>
                </label>

                <button
                    type="submit"
                    className="px-5 py-3 bg-accent text-white rounded-xl"
                >
                    Search
                </button>

            </form>

            {loading ? (
                <div className="text-center py-16">
                    Loading products...
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-16 border border-border rounded-xl">
                    No products found.
                </div>
            ) : (
                <div className="space-y-4">

                    {products.map((product) => (
                        <article
                            key={product._id}
                            className="border border-border rounded-xl p-4 flex flex-col lg:flex-row gap-4"
                        >

                            <img
                                src={
                                    product.images?.[0] ||
                                    "/images/default-product.png"
                                }
                                alt={product.title}
                                className="w-full lg:w-36 h-36 object-cover rounded-xl bg-gray-100"
                            />

                            <div className="flex-1 min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                    <h2 className="font-semibold text-lg">
                                        {product.title}
                                    </h2>

                                    <ProductStatusBadge
                                        status={product.approvalStatus}
                                    />

                                    {product.isDeleted && (
                                        <ProductStatusBadge status="deleted" />
                                    )}

                                </div>

                                <p className="text-muted text-sm mt-1">
                                    {product.productId}
                                </p>

                                <p className="text-muted mt-2">
                                    {product.category} · {product.location?.city}
                                </p>

                                <p className="font-semibold mt-2">
                                    Rs. {Number(product.pricePerDay).toLocaleString()} / day
                                </p>

                                <p className="text-sm text-muted mt-2">
                                    Owner: {product.owner?.firstName}{" "}
                                    {product.owner?.lastName}
                                    {" · "}
                                    {product.owner?.email}
                                </p>

                                {product.pendingUpdateStatus === "pending" && (
                                    <p className="text-amber-700 text-sm mt-2">
                                        An update is waiting for review.
                                    </p>
                                )}

                            </div>

                            <div className="flex flex-wrap lg:flex-col gap-2 lg:w-44">

                                <Link
                                    to={`/admin/products/${product._id}`}
                                    className="flex items-center justify-center gap-2 border border-border px-4 py-2 rounded-xl"
                                >
                                    <FaEye />
                                    View
                                </Link>

                                {product.isDeleted ? (
                                    <button
                                        onClick={() => handleRestore(product)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl"
                                    >
                                        <FaUndo />
                                        Restore
                                    </button>
                                ) : (
                                    <>
                                        {product.approvalStatus !== "approved" &&
                                            product.approvalStatus !== "pending" && (
                                                <button
                                                    onClick={() => handleStatusChange(product, "approved")}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-xl"
                                                >
                                                    Reapprove
                                                </button>
                                        )}

                                        {product.approvalStatus !== "suspended" &&
                                            product.approvalStatus !== "pending" && (
                                                <button
                                                    onClick={() => handleStatusChange(product, "suspended")}
                                                    className="px-4 py-2 bg-gray-700 text-white rounded-xl"
                                                >
                                                    Suspend
                                                </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(product)}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl"
                                        >
                                            <FaTrash />
                                            Delete
                                        </button>
                                    </>
                                )}

                            </div>

                        </article>
                    ))}

                </div>
            )}

            {!loading && pages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">

                    <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 border border-border rounded-xl disabled:opacity-40"
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {pages}
                    </span>

                    <button
                        disabled={page >= pages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 border border-border rounded-xl disabled:opacity-40"
                    >
                        Next
                    </button>

                </div>
            )}

        </div>
    );
}