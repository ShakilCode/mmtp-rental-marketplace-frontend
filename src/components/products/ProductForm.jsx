
import { useEffect, useState } from "react";

const initialForm = {
    title: "",
    description: "",
    altNames: "",
    category: "",
    pricePerDay: "",
    pricePerHour: "",
    oldPrice: "",
    deposit: "0",
    startDate: "",
    endDate: "",
    city: "",
    district: "",
    country: "Sri Lanka",
    condition: "good",
    isAvailable: true,
};

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export default function ProductForm({
    initialData,
    onSubmit,
    uploadImages,
    submitLabel = "Submit product",
    loading = false,
}) {
    const [form, setForm] = useState(initialForm);
    const [existingImages, setExistingImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!initialData) {
            setForm(initialForm);
            setExistingImages([]);
            setSelectedFiles([]);
            return;
        }

        setForm({
            title: initialData.title || "",
            description: initialData.description || "",
            altNames: (initialData.altNames || []).join(", "),
            category: initialData.category || "",
            pricePerDay: initialData.pricePerDay ?? "",
            pricePerHour: initialData.pricePerHour ?? "",
            oldPrice: initialData.oldPrice ?? "",
            deposit: initialData.deposit ?? "0",
            startDate: initialData.availability?.startDate
                ? new Date(initialData.availability.startDate)
                    .toISOString()
                    .slice(0, 10)
                : "",
            endDate: initialData.availability?.endDate
                ? new Date(initialData.availability.endDate)
                    .toISOString()
                    .slice(0, 10)
                : "",
            city: initialData.location?.city || "",
            district: initialData.location?.district || "",
            country: initialData.location?.country || "Sri Lanka",
            condition: initialData.condition || "good",
            isAvailable: initialData.isAvailable ?? true,
        });

        setExistingImages(initialData.images || []);
        setSelectedFiles([]);
    }, [initialData]);

    // Generate and clean up image preview URLs
    useEffect(() => {
        const urls = selectedFiles.map((file) =>
            URL.createObjectURL(file)
        );

        setPreviewUrls(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [selectedFiles]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFiles = (files) => {
        setError("");

        const incomingFiles = Array.from(files);

        if (!incomingFiles.length) {
            return;
        }

        const validFiles = [];

        for (const file of incomingFiles) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                setError(
                    "Only JPEG, PNG and WebP images are allowed."
                );
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                setError(
                    `${file.name} exceeds the maximum file size of 5 MB.`
                );
                return;
            }

            validFiles.push(file);
        }

        const totalImages =
            existingImages.length +
            selectedFiles.length +
            validFiles.length;

        if (totalImages > MAX_IMAGES) {
            setError("You can upload a maximum of 10 images.");
            return;
        }

        setSelectedFiles((previous) => [
            ...previous,
            ...validFiles,
        ]);
    };

    const handleFileChange = (event) => {
        handleFiles(event.target.files);
        event.target.value = "";
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);

        handleFiles(event.dataTransfer.files);
    };

    const removeExistingImage = (index) => {
        setExistingImages((previous) =>
            previous.filter((_, imageIndex) => imageIndex !== index)
        );
    };

    const removeSelectedFile = (index) => {
        setSelectedFiles((previous) =>
            previous.filter((_, fileIndex) => fileIndex !== index)
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!form.title.trim()) {
            setError("Product title is required.");
            return;
        }

        if (!form.description.trim()) {
            setError("Product description is required.");
            return;
        }

        if (!form.category.trim()) {
            setError("Category is required.");
            return;
        }

        if (
            !form.pricePerDay ||
            Number(form.pricePerDay) <= 0
        ) {
            setError("Daily rental price must be greater than zero.");
            return;
        }

        if (!form.city.trim()) {
            setError("City is required.");
            return;
        }

        if (
            form.startDate &&
            form.endDate &&
            form.startDate > form.endDate
        ) {
            setError("End date must be after the start date.");
            return;
        }

        let images = [...existingImages];

        // Upload newly selected images
        if (selectedFiles.length > 0) {
            if (!uploadImages) {
                setError("Image upload function is unavailable.");
                return;
            }

            setUploading(true);

            try {
                const uploadedImages = await uploadImages(selectedFiles);

                if (!Array.isArray(uploadedImages)) {
                    throw new Error(
                        "The server returned an invalid image response."
                    );
                }

                images = [
                    ...existingImages,
                    ...uploadedImages,
                ];

            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Image upload failed. Please try again."
                );

                setUploading(false);
                return;
            }

            setUploading(false);
        }

        if (images.length > MAX_IMAGES) {
            setError("You can provide a maximum of 10 images.");
            return;
        }

        const productData = {
            title: form.title.trim(),
            description: form.description.trim(),

            altNames: form.altNames
                .split(",")
                .map((name) => name.trim())
                .filter(Boolean),

            category: form.category.trim(),

            pricePerDay: Number(form.pricePerDay),

            pricePerHour:
                form.pricePerHour === ""
                    ? null
                    : Number(form.pricePerHour),

            oldPrice:
                form.oldPrice === ""
                    ? null
                    : Number(form.oldPrice),

            deposit: Number(form.deposit || 0),

            availability: {
                startDate: form.startDate || null,
                endDate: form.endDate || null,
            },

            location: {
                city: form.city.trim(),
                district: form.district.trim(),
                country: form.country.trim() || "Sri Lanka",
            },

            images: images.length
                ? images
                : ["/images/default-product.png"],

            condition: form.condition,

            isAvailable: form.isAvailable,
        };

        try {
            await onSubmit(productData);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save product. Please try again."
            );
        }
    };

    const inputClass =
        "w-full border border-border rounded-xl px-4 py-3 bg-background text-secondary focus:outline-none focus:ring-2 focus:ring-accent";

    const labelClass =
        "block text-sm font-medium text-secondary mb-2";

    const isSubmitting = loading || uploading;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Basic information */}
            <section className="space-y-4">

                <h2 className="text-lg font-semibold">
                    Product information
                </h2>

                <div>
                    <label className={labelClass}>
                        Product title *
                    </label>

                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={150}
                        className={inputClass}
                        placeholder="Example: Canon DSLR Camera"
                        required
                    />
                </div>

                <div>
                    <label className={labelClass}>
                        Description *
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={5}
                        maxLength={5000}
                        className={inputClass}
                        placeholder="Describe your product, features and rental conditions..."
                        required
                    />
                </div>

                <div>
                    <label className={labelClass}>
                        Alternative search names
                    </label>

                    <input
                        name="altNames"
                        value={form.altNames}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Camera, DSLR, Photography camera"
                    />

                    <p className="text-xs text-muted mt-1">
                        Separate names with commas.
                    </p>
                </div>

                <div>
                    <label className={labelClass}>
                        Category *
                    </label>

                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    >
                        <option value="">Select category</option>
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
                    <label className={labelClass}>
                        Condition
                    </label>

                    <select
                        name="condition"
                        value={form.condition}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="new">New</option>
                        <option value="like new">Like new</option>
                        <option value="good">Good</option>
                        <option value="used">Used</option>
                    </select>
                </div>

            </section>

            {/* Pricing */}
            <section className="space-y-4">

                <h2 className="text-lg font-semibold">
                    Rental pricing
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                        <label className={labelClass}>
                            Price per day (LKR) *
                        </label>

                        <input
                            name="pricePerDay"
                            type="number"
                            min="1"
                            step="0.01"
                            value={form.pricePerDay}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Price per hour (LKR)
                        </label>

                        <input
                            name="pricePerHour"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.pricePerHour}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Original price (LKR)
                        </label>

                        <input
                            name="oldPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.oldPrice}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Refundable deposit (LKR)
                        </label>

                        <input
                            name="deposit"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.deposit}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                </div>

            </section>

            {/* Availability */}
            <section className="space-y-4">

                <h2 className="text-lg font-semibold">
                    Availability
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                        <label className={labelClass}>
                            Available from
                        </label>

                        <input
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Available until
                        </label>

                        <input
                            type="date"
                            name="endDate"
                            value={form.endDate}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                </div>

            </section>

            {/* Location */}
            <section className="space-y-4">

                <h2 className="text-lg font-semibold">
                    Location
                </h2>

                <div>
                    <label className={labelClass}>
                        City *
                    </label>

                    <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                        <label className={labelClass}>
                            District
                        </label>

                        <input
                            name="district"
                            value={form.district}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Country
                        </label>

                        <input
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                </div>

            </section>

            {/* Images */}
            <section className="space-y-4">

                <h2 className="text-lg font-semibold">
                    Product images
                </h2>

                <p className="text-sm text-muted">
                    Upload up to 10 images. Maximum file size is 5 MB per image.
                    JPEG, PNG and WebP are supported.
                </p>

                {/* Drag and drop */}
                <label
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                        isDragging
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent hover:bg-accent/5"
                    }`}
                >
                    <span className="text-3xl">
                        📷
                    </span>

                    <span className="font-medium">
                        Drag and drop images here
                    </span>

                    <span className="text-sm text-muted">
                        or click to select files from your computer
                    </span>

                    <span className="text-xs text-muted">
                        JPEG, PNG or WebP
                    </span>

                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isSubmitting}
                    />
                </label>

                {/* Existing images */}
                {existingImages.length > 0 && (
                    <div className="space-y-2">

                        <h3 className="text-sm font-medium">
                            Existing images
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

                            {existingImages.map((image, index) => (
                                <div
                                    key={`${image}-${index}`}
                                    className="relative"
                                >
                                    <img
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-xl border border-border"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        disabled={isSubmitting}
                                        className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-700 disabled:opacity-50"
                                        title="Remove image"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                        </div>

                    </div>
                )}

                {/* Newly selected images */}
                {selectedFiles.length > 0 && (
                    <div className="space-y-2">

                        <h3 className="text-sm font-medium">
                            Selected images
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

                            {selectedFiles.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="relative"
                                >
                                    {previewUrls[index] && (
                                        <img
                                            src={previewUrls[index]}
                                            alt={file.name}
                                            className="w-full h-32 object-cover rounded-xl border border-border"
                                        />
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => removeSelectedFile(index)}
                                        disabled={isSubmitting}
                                        className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-700 disabled:opacity-50"
                                        title="Remove image"
                                    >
                                        ×
                                    </button>

                                    <p className="text-xs text-muted mt-1 truncate">
                                        {file.name}
                                    </p>
                                </div>
                            ))}

                        </div>

                    </div>
                )}

                <p className="text-xs text-muted">
                    {existingImages.length + selectedFiles.length} / {MAX_IMAGES} images selected
                </p>

            </section>

            {/* Availability */}
            <label className="flex items-center gap-3 border border-border p-4 rounded-xl">

                <input
                    type="checkbox"
                    name="isAvailable"
                    checked={form.isAvailable}
                    onChange={handleChange}
                    className="w-4 h-4 accent-accent"
                    disabled={isSubmitting}
                />

                <span className="text-sm font-medium">
                    Product is available for rental
                </span>

            </label>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white rounded-xl py-3 font-semibold disabled:opacity-60 hover:opacity-90 transition"
            >
                {uploading
                    ? "Uploading images..."
                    : loading
                        ? "Submitting..."
                        : submitLabel}
            </button>

        </form>
    );
}