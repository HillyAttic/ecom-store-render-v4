"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

// Define product type
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  rating: number;
  isNew?: boolean;
  isSale?: boolean;
  discount?: number;
  description?: string;
  tags?: string[];
}

const NewArrivals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistStatus, setWishlistStatus] = useState<Record<number, boolean>>({});

  // Fetch new arrivals from API
  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        setLoading(true);
        // In a real app, you would have an endpoint that returns only new products
        // For now, we'll use the regular products endpoint and filter for isNew
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch new arrivals');
        }
        
        const { data } = await response.json();
        
        // Filter for new products and limit to 4
        const newProducts = data
          .filter((product: Product) => product.isNew)
          .slice(0, 4);
        
        // Calculate discount percentage for each product
        const productsWithDiscount = newProducts.map((product: Product) => {
          if (product.originalPrice && product.price) {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            return { ...product, discount };
          }
          return product;
        });
        
        setProducts(productsWithDiscount);
        
        // Initialize wishlist status
        const initialWishlistStatus = productsWithDiscount.reduce(
          (acc: Record<number, boolean>, product: Product) => ({
            ...acc, 
            [product.id]: false
          }), 
          {}
        );
        
        setWishlistStatus(initialWishlistStatus);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchNewArrivals();
  }, []);

  const toggleWishlist = (productId: number) => {
    setWishlistStatus(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-4 animate-pulse h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6">New Arrivals</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative">
              <Link href={`/products/${product.id}`}>
                <div className="aspect-square relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm"
              >
                <Heart
                  size={18}
                  className={wishlistStatus[product.id] ? "fill-red-500 text-red-500" : "text-gray-400"}
                />
              </button>
              {product.discount && product.discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.discount}% OFF
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                NEW
              </div>
            </div>
            <div className="p-3">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-medium text-gray-900 text-sm mb-1 hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 text-sm">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-500 text-xs line-through ml-1">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals; 