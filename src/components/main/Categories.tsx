import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Building2, Landmark, Warehouse, ShoppingBag, TreePine, MapPin } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Home,
  Building2,
  Landmark,
  Warehouse,
  ShoppingBag,
  TreePine,
  MapPin
};

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.propertyCategories) {
          setCategories(data.data.propertyCategories);
        }
      });
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Categories</h2>
          <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Explore Our Properties</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Choose from a wide variety of property types tailored to your specific needs and lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Home;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center card-hover"
              >
                <div className={`p-6 rounded-2xl mb-6 transition-transform group-hover:scale-110 ${cat.color}`}>
                  <Icon size={48} />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{cat.name}</h4>
                {/* Count could be dynamic later if we fetch actual property counts */}
                <p className="text-gray-500 font-medium">Browse All</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
