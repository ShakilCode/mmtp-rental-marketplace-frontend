import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FaPlus,
    FaEye,
    FaEdit,
    FaTrash,
    FaSync,
} from "react-icons/fa";

import {
    getMyProducts,
    withdrawProduct,
} from "../../api/productApi";

import ProductStatusBadge from "../../components/products/ProductStatusBadge";

export default function MyProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const location = useLocation();
    const [message, setMessage] = useState(
        location.state?.message || ""
    );

    const fetchProducts = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getMyProducts();

            setProducts(response.data.products || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load your products."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleWithdraw = async (product) => {
        const confirmed = window.confirm(
            `Are you sure you want to withdraw "${product.title}"?`
        );

        if (!confirmed) return;

        setMessage("");
        setError("");

        try {
            await withdrawProduct(product._id);

            setMessage("Product withdrawn successfully.");

            await fetchProducts();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to withdraw product."
            );
        }
    };

    const getEditPermission = (product) => {
        if (product.approvalStatus === "pending") {
            return false;
        }

        if (
            product.pendingUpdateStatus === "pending" &&
            product.pendingChanges
        ) {
            return false;
        }

        if (product.approvalStatus === "suspended") {
            return false;
        }

        return true;
    };

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6">

            <div className="max-w-7xl mx-auto">

                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl font-bold">
                            My products
                        </h1>

                        <p className="text-muted mt-2">
                            Manage your rental listings.
                        </p>
                    </div>

                    <Link
                        to="/lender/products/add"
                        className="flex items-center gap-2 bg-accent text-white px-5 py-3 rounded-xl"
                    >
                        <FaPlus />
                        Add product
                    </Link>

                </div>

                <div className="flex justify-end mb-4">

                    <button
                        onClick={fetchProducts}
                        className="flex items-center gap-2 border border-border px-4 py-2 rounded-xl"
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
                    <div className="text-center py-20">
                        Loading your products...
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-surface border border-border rounded-2xl p-10 text-center">

                        <h2 className="text-xl font-semibold">
                            You haven't listed any products yet.
                        </h2>

                        <p className="text-muted mt-2">
                            Add your first product to start renting it out.
                        </p>

                        <Link
                            to="/lender/products/add"
                            className="inline-block mt-5 bg-accent text-white px-5 py-3 rounded-xl"
                        >
                            Add your first product
                        </Link>

                    </div>
                ) : (
                    <div className="bg-surface border border-border rounded-2xl overflow-hidden">

                        <div className="grid grid-cols-1 gap-4 p-4">

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
                                        className="w-full lg:w-40 h-40 object-cover rounded-xl bg-gray-100"
                                        onError={(event) => {
                                            event.currentTarget.src =
                                                "/images/default-product.png";
                                        }}
                                    />

                                    <div className="flex-1 min-w-0">

                                        <div className="flex flex-wrap gap-2 items-center">

                                            <h2 className="text-lg font-semibold">
                                                {product.title}
                                            </h2>

                                            <ProductStatusBadge
                                                status={product.approvalStatus}
                                            />

                                        </div>

                                        <p className="text-muted text-sm mt-1">
                                            {product.productId}
                                        </p>

                                        <p className="text-muted mt-2">
                                            {product.location?.city}
                                        </p>

                                        <p className="font-semibold mt-2">
                                            Rs. {Number(product.pricePerDay).toLocaleString()} / day
                                        </p>

                                        {/* Initial product review */}
                                        {product.approvalStatus === "pending" && (
                                            <p className="text-amber-700 text-sm mt-3">
                                                Your product is waiting for administrator approval.
                                            </p>
                                        )}

                                        {/* Initial rejection */}
                                        {product.approvalStatus === "rejected" && (
                                            <div className="mt-3 p-3 bg-red-50 rounded-lg">

                                                <p className="font-medium text-red-700 text-sm">
                                                    Product rejected
                                                </p>

                                                <p className="text-red-700 text-sm mt-1">
                                                    {product.rejectionReason ||
                                                        "Please review your product information."}
                                                </p>

                                            </div>
                                        )}

                                        {/* Pending update */}
                                        {product.pendingUpdateStatus === "pending" &&
                                            product.pendingChanges && (
                                                <p className="text-amber-700 text-sm mt-3">
                                                    Your proposed changes are waiting for administrator approval.
                                                </p>
                                            )}

                                        {/* Rejected update */}
                                        {product.pendingUpdateStatus === "rejected" && (
                                            <div className="mt-3 p-3 bg-red-50 rounded-lg">

                                                <p className="font-medium text-red-700 text-sm">
                                                    Proposed update rejected
                                                </p>

                                                <p className="text-red-700 text-sm mt-1">
                                                    {product.pendingUpdateRejectionReason ||
                                                        "Your proposed changes were not approved."}
                                                </p>

                                                <p className="text-xs text-red-600 mt-2">
                                                    Your original approved listing remains unchanged.
                                                </p>

                                            </div>
                                        )}

                                        {/* Suspended */}
                                        {product.approvalStatus === "suspended" && (
                                            <p className="text-gray-700 text-sm mt-3">
                                                This listing is suspended. Please contact an administrator.
                                            </p>
                                        )}

                                    </div>

                                    <div className="flex flex-wrap lg:flex-col gap-2 lg:w-44">

                                        <Link
                                            to={`/lender/products/${product._id}`}
                                            className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-xl"
                                        >
                                            <FaEye />
                                            View
                                        </Link>

                                        {getEditPermission(product) && (
                                            <Link
                                                to={`/lender/products/${product._id}/edit`}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-xl"
                                            >
                                                <FaEdit />
                                                Edit
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => handleWithdraw(product)}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl"
                                        >
                                            <FaTrash />
                                            Withdraw
                                        </button>

                                    </div>

                                </article>
                            ))}

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}