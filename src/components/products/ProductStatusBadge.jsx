const statusStyles = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    suspended: "bg-gray-200 text-gray-800",
    deleted: "bg-gray-100 text-gray-600",
};

export default function ProductStatusBadge({ status }) {
    const normalizedStatus = status || "pending";

    const style =
        statusStyles[normalizedStatus] ||
        "bg-gray-100 text-gray-700";

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${style}`}
        >
            {normalizedStatus.replaceAll("-", " ")}
        </span>
    );
}