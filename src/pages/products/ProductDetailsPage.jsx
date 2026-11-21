import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FaMapMarkerAlt,
    FaArrowLeft,
} from "react-icons/fa";

import { getPublicProduct } from "../../api/productApi";

export default function ProductDetailsPage() {
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await getPublicProduct(productId);

                const data = response.data.product;

                setProduct(data);
                setSelectedImage(
                    data.images?.[0] ||
                    "/images/default-product.png"
                );
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Product could not be found."
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
            <div className="min-h-screen p-6">

                <Link to="/products" className="text-accent">
                    <FaArrowLeft className="inline mr-2" />
                    Back to products
                </Link>

                <div className="mt-8 text-red-600">
                    {error || "Product not found"}
                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">

            <header className="bg-surface border-b border-border">

                <div className="max-w-7xl mx-auto px-4 py-5">

                    <Link
                        to="/products"
                        className="text-accent flex items-center gap-2"
                    >
                        <FaArrowLeft />
                        Back to products
                    </Link>

                </div>

            </header>

            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Images */}
                    <section>

                        <div className="bg-surface rounded-2xl border border-border overflow-hidden">

                            <img
                                src={selectedImage}
                                alt={product.title}
                                className="w-full h-[400px] sm:h-[500px] object-contain bg-gray-50"
                                onError={(event) => {
                                    event.currentTarget.src =
                                        "/images/default-product.png";
                                }}
                            />

                        </div>

                        {product.images?.length > 1 && (
                            <div className="flex gap-3 mt-4 overflow-x-auto">

                                {product.images.map((image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        onClick={() => setSelectedImage(image)}
                                        className={`shrink-0 border-2 rounded-xl overflow-hidden ${
                                            selectedImage === image
                                                ? "border-accent"
                                                : "border-border"
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.title} ${index + 1}`}
                                            className="w-20 h-20 object-cover"
                                        />
                                    </button>
                                ))}

                            </div>
                        )}

                    </section>

                    {/* Details */}
                    <section className="bg-surface border border-border rounded-2xl p-6 sm:p-8">

                        <p className="text-sm text-accent font-medium">
                            {product.category}
                        </p>

                        <h1 className="text-3xl font-bold mt-2">
                            {product.title}
                        </h1>

                        <p className="text-muted mt-4 flex items-center gap-2">
                            <FaMapMarkerAlt />
                            {product.location?.city}
                            {product.location?.district
                                ? `, ${product.location.district}`
                                : ""}
                        </p>

                        <div className="mt-6 border-b border-border pb-6">

                            <p className="text-sm text-muted">
                                Rental price
                            </p>

                            <p className="text-3xl font-bold mt-1">
                                Rs. {Number(product.pricePerDay).toLocaleString()}
                                <span className="text-base text-muted font-normal">
                                    {" "}per day
                                </span>
                            </p>

                            {product.pricePerHour != null && (
                                <p className="text-muted mt-2">
                                    Rs. {Number(product.pricePerHour).toLocaleString()} per hour
                                </p>
                            )}

                            {product.oldPrice != null && (
                                <p className="text-muted text-sm mt-2 line-through">
                                    Original price: Rs. {Number(product.oldPrice).toLocaleString()}
                                </p>
                            )}

                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">

                            <div className="p-4 bg-background rounded-xl">
                                <p className="text-sm text-muted">
                                    Condition
                                </p>

                                <p className="font-semibold capitalize mt-1">
                                    {product.condition}
                                </p>
                            </div>

                            <div className="p-4 bg-background rounded-xl">
                                <p className="text-sm text-muted">
                                    Deposit
                                </p>

                                <p className="font-semibold mt-1">
                                    Rs. {Number(product.deposit || 0).toLocaleString()}
                                </p>
                            </div>

                        </div>

                        <div className="mt-6">

                            <h2 className="font-semibold text-lg">
                                Description
                            </h2>

                            <p className="text-muted leading-7 mt-3 whitespace-pre-wrap">
                                {product.description}
                            </p>

                        </div>

                        <div className="mt-6">

                            <h2 className="font-semibold">
                                Availability
                            </h2>

                            <p className="text-muted mt-2">
                                {product.availability?.startDate
                                    ? new Date(product.availability.startDate).toLocaleDateString()
                                    : "Available immediately"}
                                {" — "}
                                {product.availability?.endDate
                                    ? new Date(product.availability.endDate).toLocaleDateString()
                                    : "No end date specified"}
                            </p>

                        </div>

                        <Link
                            to="/login"
                            className="mt-8 block text-center bg-accent text-white py-3 rounded-xl font-semibold"
                        >
                            Login to rent this product
                        </Link>

                    </section>

                </div>

            </main>

        </div>
    );
}