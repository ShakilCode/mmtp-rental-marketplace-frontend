import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaSlidersH } from "react-icons/fa";

import { getPublicProducts } from "../../api/productApi";
import ProductCard from "../../components/products/ProductCard";

export default function PublicProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [city, setCity] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const fetchProducts = async () => {
        setLoading(true);
        setError("");

        try {
            const params = {
                page,
                limit: 12,
            };

            if (search.trim()) params.search = search.trim();
            if (category) params.category = category;
            if (city.trim()) params.city = city.trim();
            if (minPrice !== "") params.minPrice = minPrice;
            if (maxPrice !== "") params.maxPrice = maxPrice;

            const response = await getPublicProducts(params);

            setProducts(response.data.products || []);
            setPages(response.data.pages || 1);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const handleSearch = (event) => {
        event.preventDefault();
        setPage(1);
        fetchProductsForPageOne();
    };

    const fetchProductsForPageOne = async () => {
        setLoading(true);
        setError("");

        try {
            const params = {
                page: 1,
                limit: 12,
            };

            if (search.trim()) params.search = search.trim();
            if (category) params.category = category;
            if (city.trim()) params.city = city.trim();
            if (minPrice !== "") params.minPrice = minPrice;
            if (maxPrice !== "") params.maxPrice = maxPrice;

            const response = await getPublicProducts(params);

            setProducts(response.data.products || []);
            setPages(response.data.pages || 1);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = async () => {
        setSearch("");
        setCategory("");
        setCity("");
        setMinPrice("");
        setMaxPrice("");
        setPage(1);

        setLoading(true);
        setError("");

        try {
            const response = await getPublicProducts({
                page: 1,
                limit: 12,
            });

            setProducts(response.data.products || []);
            setPages(response.data.pages || 1);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">

            {/* Header */}
            <header className="bg-surface border-b border-border">

                <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-4">

                    <Link
                        to="/"
                        className="text-2xl font-bold text-secondary"
                    >
                        MMTP
                    </Link>

                    <div className="flex gap-3">

                        <Link
                            to="/login"
                            className="px-4 py-2 rounded-xl border border-border"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="px-4 py-2 rounded-xl bg-accent text-white"
                        >
                            Register
                        </Link>

                    </div>

                </div>

            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-secondary">
                        Explore products
                    </h1>

                    <p className="text-muted mt-2">
                        Find products available for rent around you.
                    </p>

                </div>

                {/* Search and filters */}
                <form
                    onSubmit={handleSearch}
                    className="bg-surface border border-border rounded-2xl p-5 mb-8"
                >

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        <div className="lg:col-span-2">

                            <label className="text-sm font-medium block mb-2">
                                Search
                            </label>

                            <div className="flex items-center border border-border rounded-xl px-3">

                                <FaSearch className="text-muted" />

                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full bg-transparent outline-none px-3 py-3"
                                />

                            </div>

                        </div>

                        <div>

                            <label className="text-sm font-medium block mb-2">
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full border border-border rounded-xl px-3 py-3 bg-background"
                            >
                                <option value="">All categories</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Photography">Photography</option>
                                <option value="Vehicles">Vehicles</option>
                                <option value="Tools">Tools</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Sports">Sports</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Home Appliances">Home Appliances</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Others">Others</option>
                            </select>

                        </div>

                        <div>

                            <label className="text-sm font-medium block mb-2">
                                City
                            </label>

                            <input
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Colombo"
                                className="w-full border border-border rounded-xl px-3 py-3 bg-background"
                            />

                        </div>

                        <div>

                            <label className="text-sm font-medium block mb-2">
                                Minimum price / day
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full border border-border rounded-xl px-3 py-3 bg-background"
                            />

                        </div>

                        <div>

                            <label className="text-sm font-medium block mb-2">
                                Maximum price / day
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full border border-border rounded-xl px-3 py-3 bg-background"
                            />

                        </div>

                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">

                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-accent text-white px-5 py-3 rounded-xl"
                        >
                            <FaSlidersH />
                            Apply filters
                        </button>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="px-5 py-3 rounded-xl border border-border"
                        >
                            Clear filters
                        </button>

                    </div>

                </form>

                {/* Products */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20 text-muted">
                        Loading products...
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-surface border border-border rounded-2xl">

                        <h2 className="text-xl font-semibold">
                            No products found
                        </h2>

                        <p className="text-muted mt-2">
                            Try changing your search or filters.
                        </p>

                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ))}

                    </div>
                )}

                {/* Pagination */}
                {!loading && pages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-10">

                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((previous) => previous - 1)}
                            className="px-4 py-2 rounded-xl border border-border disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-muted">
                            Page {page} of {pages}
                        </span>

                        <button
                            disabled={page >= pages}
                            onClick={() => setPage((previous) => previous + 1)}
                            className="px-4 py-2 rounded-xl border border-border disabled:opacity-40"
                        >
                            Next
                        </button>

                    </div>
                )}

            </main>

        </div>
    );
}