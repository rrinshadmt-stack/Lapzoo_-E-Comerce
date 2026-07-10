import { useState, useEffect } from "react";

const products = [
  {
    id: 1,
    name: "Gaming",
    description: "High-performance laptop for gaming.",
    image: "https://assets.videomaker.com/2023/01/Predator-Helios-16-PH16-71-01.png",
  },
  {
    id: 2,
    name: "Multi tasking",
    description: "The Perfect Choice for Editing and Gaming.",
    image: "https://delta-game.ru/wp-content/uploads/2019/03/Dell-Alienware-M15-M15-5539.png"
  },
  {
    id: 3,
    name: "Study",
    description: "Lightweight and portable for students.",
    image: "https://www.pngall.com/wp-content/uploads/8/Lenovo-Laptop-PNG-Clipart.png",
  },
  {
    id: 4,
    name: "Creative Work",
    description: "Ideal for design, video editing, and creativity.",
    image:"https://storage-asset.msi.com/event/2023/NB/SteelSeriesGG/images/MSI_NB_Vector-GP77_photo01.png",
  },
];

export default function ProductSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentProduct = products[currentIndex];

  return (
    <div className="relative w-[90%] h-[50vh] mx-auto bg-zinc-900 overflow-hidden rounded-xl  flex items-center justify-center">
      
      {/* Floating Image */}
      <img
        src={currentProduct.image}
        alt={currentProduct.name}
        className="max-h-[70%] max-w-full object-contain animate-float"
      />

      {/* Product Info */}
      <div className="absolute bottom-4 text-center text-white w-full">
        <h2 className="text-2xl font-bold">{currentProduct.name}</h2>
        <p className="text-zinc-300">{currentProduct.description}</p>
      </div>
    </div>
  );
}
