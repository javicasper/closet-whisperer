'use client';

import Link from 'next/link';
import { Grid, Column, Button, Tile } from '@carbon/react';
import { Upload, Collaborate, Clean } from '@carbon/icons-react';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Grid fullWidth narrow className="mb-8">
        <Column lg={16} md={8} sm={4}>
          <div className="text-center py-12">
            <h1 className="text-5xl font-bold mb-4" style={{ fontSize: '3rem', fontWeight: 600 }}>
              Welcome to Closet Whisperer
            </h1>
            <p className="text-xl mb-8" style={{ fontSize: '1.25rem', color: 'var(--cds-text-secondary)' }}>
              Your AI-powered virtual closet. Upload your clothes, get smart outfit
              suggestions, and never wonder what to wear again.
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <Link href="/closet">
                <Button size="lg" renderIcon={Upload}>
                  View My Closet
                </Button>
              </Link>
              <Link href="/builder">
                <Button kind="secondary" size="lg" renderIcon={Collaborate}>
                  Build an Outfit
                </Button>
              </Link>
            </div>
          </div>
        </Column>
      </Grid>

      {/* Features Grid */}
      <Grid fullWidth narrow>
        <Column lg={16} md={8} sm={4}>
          <h2 className="text-2xl font-semibold mb-6" style={{ fontSize: '1.75rem', fontWeight: 600 }}>
            Features
          </h2>
        </Column>
        <Column lg={5} md={4} sm={4} className="mb-4">
          <Tile className="h-full p-6 text-center">
            <div className="flex justify-center mb-4">
              <Upload size={48} style={{ color: 'var(--cds-icon-primary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Upload & Organize</h3>
            <p style={{ color: 'var(--cds-text-secondary)' }}>
              Take photos of your clothes and let AI automatically categorize them with smart tagging.
            </p>
          </Tile>
        </Column>
        <Column lg={5} md={4} sm={4} className="mb-4">
          <Tile className="h-full p-6 text-center">
            <div className="flex justify-center mb-4">
              <Collaborate size={48} style={{ color: 'var(--cds-icon-primary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Suggestions</h3>
            <p style={{ color: 'var(--cds-text-secondary)' }}>
              Get personalized outfit recommendations based on occasion, weather, and your style.
            </p>
          </Tile>
        </Column>
        <Column lg={6} md={8} sm={4} className="mb-4">
          <Tile className="h-full p-6 text-center">
            <div className="flex justify-center mb-4">
              <Clean size={48} style={{ color: 'var(--cds-icon-primary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Track Everything</h3>
            <p style={{ color: 'var(--cds-text-secondary)' }}>
              Keep track of what's in the laundry, what's available, and what needs attention.
            </p>
          </Tile>
        </Column>
      </Grid>

      {/* Quick Start Section */}
      <Grid fullWidth narrow className="mt-12">
        <Column lg={16} md={8} sm={4}>
          <Tile className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
            <p className="mb-6" style={{ color: 'var(--cds-text-secondary)' }}>
              Ready to get started? Here's what you can do:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">1. Upload Your First Garment</h4>
                <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                  Go to your closet and upload photos of your clothes. Our AI will analyze and categorize them.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Build Your First Outfit</h4>
                <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                  Use the outfit builder to mix and match, or let AI suggest combinations for you.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Manage Your Laundry</h4>
                <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                  Mark items as "in laundry" to keep track of what's available to wear.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">4. Get AI Suggestions</h4>
                <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                  Describe the occasion or weather, and get instant outfit recommendations.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/closet">
                <Button>Get Started Now</Button>
              </Link>
            </div>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
