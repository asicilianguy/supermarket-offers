"use client";
import { motion } from "framer-motion";
import { Check, ShoppingCart } from "lucide-react";
import { SUPERMARKETS } from "@/constants/supermarkets";

interface SupermarketSelectorProps {
  selectedSupermarkets: string[];
  onChange: (supermarkets: string[]) => void;
}

export default function SupermarketSelector({
  selectedSupermarkets,
  onChange,
}: SupermarketSelectorProps) {
  const toggleSupermarket = (supermarket: string) => {
    if (selectedSupermarkets.includes(supermarket)) {
      onChange(selectedSupermarkets.filter((s) => s !== supermarket));
    } else {
      onChange([...selectedSupermarkets, supermarket]);
    }
  };

  // Function to get a color based on the supermarket name
  const getSupermarketColor = (name: string) => {
    const colors = [
      "from-primary-500 to-primary-600",
      "from-secondary-500 to-secondary-600",
      "from-accent-500 to-accent-600",
      "from-primary-600 to-secondary-500",
      "from-secondary-600 to-accent-500",
      "from-accent-600 to-primary-500",
    ];

    // Use the first character of the supermarket name to determine the color
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {SUPERMARKETS.map(({ value, label }) => {
        const isSelected = selectedSupermarkets.includes(label);
        return (
          <motion.div
            key={label}
            className={`relative overflow-hidden rounded-xl shadow-md cursor-pointer transition-all duration-300 ${
              isSelected
                ? "ring-2 ring-primary-500 ring-offset-2"
                : "ring-1 ring-gray-200"
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleSupermarket(label)}
            layout
          >
            <div
              className={`h-full bg-gradient-to-br ${getSupermarketColor(
                label
              )} p-4 text-white`}
            >
              <div className="flex items-center justify-between">
                <ShoppingCart className="h-5 w-5" />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-white rounded-full p-1 text-primary-600"
                  >
                    <Check className="h-3 w-3" />
                  </motion.div>
                )}
              </div>
              <p className="mt-2 font-medium">{label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
