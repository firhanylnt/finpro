"use client";

import { useState, useEffect, useCallback, Key } from "react";
import useEmblaCarousel from "embla-carousel-react";

const ProductDetail = ({ product }: any) => {
  const [quantity, setQuantity] = useState(1);
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [thumbRef, thumbApi] = useEmblaCarousel({ containScroll: "keepSnaps", dragFree: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product.products.name} to cart!`);
  };

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setSelectedIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  }, [emblaApi]);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 md:px-6">
      <nav className="text-xs md:text-sm text-gray-500 mb-4">
        Home &gt; {product.products.productcategory.name} &gt;{" "}
        <span className="text-red-500 font-semibold">{product.products.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="overflow-hidden rounded-lg shadow-lg" ref={emblaRef}>
            <div className="flex">
              {product.products.productimages.map((img: { image_url: any; }, index: Key | null | undefined) => (
                <div className="min-w-full" key={index}>
                  <img
                    src={img.image_url || "/placeholder.jpg"}
                    alt={product.products.name}
                    width={300}
                    height={300}
                    className="object-cover w-full h-auto rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex space-x-2 overflow-x-auto" ref={thumbRef}>
            {product.products.productimages.map((img: { image_url: any; }, index: number) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`border ${
                  selectedIndex === index ? "border-blue-500" : "border-gray-300"
                } rounded-lg p-1 transition duration-200`}
              >
                <img
                  src={img.image_url || "/placeholder.jpg"}
                  alt={product.products.name}
                  width={60}
                  height={60}
                  className="object-cover w-14 h-14 md:w-16 md:h-16 rounded"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{product.products.name}</h1>

          <p className="text-gray-600 mt-2 text-sm md:text-base">
            <span className="font-semibold">Stock {product.qty}</span> <br />
            <span className="text-red-500 text-xs md:text-sm">
              Pengiriman dilakukan pada hari yang sama.
            </span>
          </p>

          <div className="mt-2">
            {product.products.productdiscount?.length > 0 ? (
            <div className="flex flex-col gap-1">
                {product.products.productdiscount[0].discount.discount_type_id === 1 && (
                <div>
                    <span className="text-red-500 font-bold text-lg">
                    Rp {(Number(product.products.price) - product.products.productdiscount[0].discount.amount).toLocaleString()}
                    </span>
                    <del className="text-gray-500 text-sm ml-2">Rp {product.products.price.toLocaleString()}</del>
                </div>
                )}
                {product.products.productdiscount[0].discount.discount_type_id === 2 && (
                <div>
                    <span className="text-red-500 font-bold text-lg">
                    Rp {(Number(product.products.price) - (Number(product.products.price) * product.products.productdiscount[0].discount.amount) / 100).toLocaleString()}
                    </span>
                    <del className="text-gray-500 text-sm ml-2">Rp {product.products.price.toLocaleString()}</del>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-md ml-2">
                    -{product.products.productdiscount[0].discount.amount}%
                    </span>
                </div>
                )}
                {product.products.productdiscount[0].discount.discount_type_id === 3 && (
                <div className="flex flex-col">
                    <span className="text-gray-500 font-bold text-lg">Rp {product.products.price.toLocaleString()}</span>
                    <span className="bg-yellow-300 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-md mt-1 w-max">
                    Buy 1 Get 1
                    </span>
                </div>
                )}
            </div>
            ) : (
            <span className="text-red-500 font-bold text-lg">Rp {product.products.price.toLocaleString()}</span>
            )}
        </div>

          <div className="mt-4">
            <h3 className="font-bold text-sm md:text-base">Deskripsi</h3>
            <div className="text-gray-700 mt-2 text-xs md:text-sm list-disc list-inside">
            <p>
                {product.products.description}
            </p>
            </div>
          </div>

          <div className="flex items-center mt-6 space-x-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="border border-gray-300 px-3 py-1 rounded-lg text-lg"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-12 text-sm md:w-16 border py-2 mx-2 text-center rounded-lg"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="border border-gray-300 px-3 py-1 rounded-lg text-lg"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.qty < 1}
            className="mt-4 bg-red-600 text-white px-4 md:px-6 py-2 rounded-lg w-full font-bold text-sm md:text-lg transition duration-300 hover:bg-red-700 disabled:bg-gray-500"
          >
            {product.qty < 1 ? 'Sold Out' : '+ Keranjang'}
          </button>

          <div className="mt-6 border p-4 rounded-lg bg-gray-100 text-xs md:text-sm">
            <h3 className="font-bold">Pengiriman</h3>
            <p className="text-gray-700 mt-1">
              Dikirim oleh{" "}
              <span className="font-semibold">BLJN Instant Delivery</span>
            </p>
            <p className="text-green-600 font-bold">Biaya Pengiriman: Gratis</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
