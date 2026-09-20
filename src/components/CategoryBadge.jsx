import { CATEGORIES } from "../store/reportsStore";

export default function CategoryBadge({ category, size = "sm" }) {
  const cat = CATEGORIES[category] || {
    label: category,
    bg: "bg-white/10",
    text: "text-white/70",
    icon: "📌",
  };

  const sizeClass = size === "lg"
    ? "px-4 py-1.5 text-sm gap-2"
    : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span className={`category-badge ${cat.bg} ${cat.text} ${sizeClass}`}>
      <span>{cat.icon}</span>
      {cat.label}
    </span>
  );
}
