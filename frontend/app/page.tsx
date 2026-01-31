'use client';

import Link from 'next/link';
import UploadGarment from '@/components/UploadGarment';

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to Closet Whisperer
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your AI-powered virtual closet. Upload your clothes, get smart outfit
          suggestions, and never wonder what to wear again.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 my-12">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-4xl mb-4">📸</div>
          <h3 className="text-xl font-semibold mb-2">Upload & Organize</h3>
          <p className="text-gray-600">
            Take photos of your clothes and let AI automatically categorize them
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-xl font-semibold mb-2">AI Suggestions</h3>
          <p className="text-gray-600">
            Get personalized outfit recommendations based on occasion and weather
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-4xl mb-4">🧺</div>
          <h3 className="text-xl font-semibold mb-2">Track Everything</h3>
          <p className="text-gray-600">
            Keep track of what's in the laundry and what's available
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Upload Your First Garment
        </h2>
        <UploadGarment />
      </div>

      <div className="text-center space-x-4">
        <Link
          href="/closet"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          View My Closet
        </Link>
        <Link
          href="/builder"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700"
        >
          Build an Outfit
        </Link>
      </div>
    </div>
  );
}
