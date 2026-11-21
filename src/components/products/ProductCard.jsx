import { Link } from "react-router-dom";
import {
    FaMapMarkerAlt,
    FaTag,
} from "react-icons/fa";

export default function ProductCard({ product }) {
    const image =
        product.images?.[0] ||
        "/images/default-product.png";

    return (
        <article className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">

            <Link to={`/products/${product.productId}`}>
                <div className="h-56 bg-gray-100 overflow-hidden">
                    <img
                        src={image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={(event) => {
                            event.currentTarget.src =
                                "/images/default-product.png";
                        }}
                    />
                </div>
            </Link>

            <div className="p-5">

                <div className="flex items-start justify-between gap-3">

                    <h3 className="font-semibold text-lg text-secondary line-clamp-2">
                        {product.title}
                    </h3>

                </div>

                <p className="text-muted text-sm mt-2 flex items-center gap-2">
                    <FaMapMarkerAlt />
                    {product.location?.city || "Location unavailable"}
                </p>

                <p className="text-muted text-sm mt-2 line-clamp-2">
                    {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">

                    <div>
                        <p className="text-xs text-muted">
                            Rental price
                        </p>

                        <p className="text-xl font-bold text-secondary">
                            Rs. {Number(product.pricePerDay).toLocaleString()}
                            <span className="text-sm font-normal text-muted">
                                {" "} / day
                            </span>
                        </p>
                    </div>

                    <span className="text-xs capitalize bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        {product.condition || "good"}
                    </span>

                </div>

                {product.pricePerHour != null && (
                    <p className="text-sm text-muted mt-1">
                        Rs. {Number(product.pricePerHour).toLocaleString()} / hour
                    </p>
                )}

                {product.deposit > 0 && (
                    <p className="text-xs text-muted mt-2">
                        Deposit: Rs. {Number(product.deposit).toLocaleString()}
                    </p>
                )}

                <Link
                    to={`/products/${product.productId}`}
                    className="mt-5 block text-center w-full bg-accent text-white rounded-xl py-3 font-medium hover:opacity-90 transition"
                >
                    View product
                </Link>

            </div>

        </article>
    );
}