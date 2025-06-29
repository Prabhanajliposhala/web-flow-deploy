
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Server, Shield, Zap } from 'lucide-react';

const WorkflowConfig = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <GitBranch className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">GitHub Actions Workflow</h3>
          <Badge variant="secondary">main.yml</Badge>
        </div>
        
        <div className="bg-slate-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <pre className="whitespace-pre-wrap">{`name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Build application
      run: |
        npm ci
        npm run build
    
    - name: Build Docker image
      run: |
        docker build -t webapp:latest .
        docker tag webapp:latest webapp:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to staging
      run: echo "Deploying to staging..."
    
    - name: Run integration tests
      run: echo "Running integration tests..."
    
    - name: Deploy to production
      run: echo "Deploying to production..."`}</pre>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h4 className="font-medium">Triggers</h4>
          </div>
          <ul className="space-y-1 text-sm text-slate-600">
            <li>• Push to main/develop</li>
            <li>• Pull requests to main</li>
            <li>• Manual dispatch</li>
          </ul>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Server className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium">Environments</h4>
          </div>
          <ul className="space-y-1 text-sm text-slate-600">
            <li>• Development</li>
            <li>• Staging</li>
            <li>• Production</li>
          </ul>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Shield className="h-5 w-5 text-green-500" />
            <h4 className="font-medium">Security</h4>
          </div>
          <ul className="space-y-1 text-sm text-slate-600">
            <li>• Dependency scanning</li>
            <li>• Security audits</li>
            <li>• Code analysis</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default WorkflowConfig;
