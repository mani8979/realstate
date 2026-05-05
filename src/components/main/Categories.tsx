import React from 'react';
import Link from 'next/link';
import { Home, Building2, Landmark, Warehouse } from 'lucide-react';

const categories = [
  { name: 'Houses', icon: Home, count: '120+', color: 'bg-blue-50 text-blue-600', href: '/properties?type=House' },
  { name: 'Apartments', icon: Building2, count: '85+', color: 'bg-emerald-50 text-emerald-600', href: '/properties?type=Apartment' },
  { name: 'Residential Lands', icon: Landmark, count: '45+', color: 'bg-amber-50 text-amber-600', href: '/properties?type=Plot&subType=Residential' },
  { name: 'Commercial Lands', icon: Warehouse, count: '30+', color: 'bg-purple-50 text-purple-600', href: '/properties?type=Plot&subType=Commercial' },
  { name: 'Farm Lands', icon: Landmark, count: '25+', color: 'bg-green-50 text-green-600', href: '/properties?type=Plot&subType=Farm Land' },
  { name: 'Commercial', icon: Building2, count: '15+', color: 'bg-indigo-50 text-indigo-600', href: '/properties?type=Commercial' },
];

const Categories = () => {
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
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center card-hover"
            >
              <div className={`p-6 rounded-2xl mb-6 transition-transform group-hover:scale-110 ${cat.color}`}>
                <cat.icon size={48} />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{cat.name}</h4>
              <p className="text-gray-500 font-medium">{cat.count} Properties</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
