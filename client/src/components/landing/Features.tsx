// FeatureSection.jsx
import React from 'react';

const features = [
  {
    icon: '🚀',
    title: 'Fast Transfers',
    description: 'Experience lightning-fast transfers over local networks.',
  },
  {
    icon: '😆',
    title: 'Quirky Delivery',
    description: 'Enjoy a humorously frustrating transfer process.',
  },
  {
    icon: '🌧️',
    title: 'Real-time Weather Effects',
    description: 'Weather impacts pigeon flight paths for a unique experience.',
  },
  {
    icon: '🕵️',
    title: 'Privacy Focused',
    description: 'All transfers stay within your local network.',
  },
];

const FeatureSection = () => (
  <section className="py-12 bg-base-100 text-center">
    <h2 className="text-3xl font-bold mb-8">Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <div key={index} className="card bg-base-200 shadow-lg p-6">
          <div className="text-5xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default FeatureSection;
