
import React from 'react';
import PipelineDashboard from '../components/PipelineDashboard';
import Header from '../components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            CI/CD Pipeline Dashboard
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Automated CI/CD Pipeline for Web Applications using GitHub Actions and Docker
          </p>
        </div>
        <PipelineDashboard />
      </main>
    </div>
  );
};

export default Index;
