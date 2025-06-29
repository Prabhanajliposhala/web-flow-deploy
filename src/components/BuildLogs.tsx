
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Maximize2, Minimize2 } from 'lucide-react';
import { PipelineStatus } from './PipelineDashboard';

interface BuildLogsProps {
  stages: PipelineStatus[];
  isRunning: boolean;
}

const BuildLogs = ({ stages, isRunning }: BuildLogsProps) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const sampleLogs = {
    'Code Checkout': [
      '🔄 Checking out repository...',
      '✓ Repository checked out successfully',
      '📂 Working directory: /github/workspace'
    ],
    'Install Dependencies': [
      '📦 Installing dependencies...',
      'npm WARN deprecated package@1.0.0',
      '✓ Dependencies installed successfully',
      '🔍 Found 0 vulnerabilities'
    ],
    'Run Tests': [
      '🧪 Running test suite...',
      'PASS src/components/Header.test.tsx',
      'PASS src/components/PipelineStages.test.tsx',
      '✓ All tests passed (12 tests, 0 failures)'
    ],
    'Build Application': [
      '🏗️ Building application...',
      '📦 Bundling assets...',
      '⚡ Optimizing build...',
      '✓ Build completed successfully'
    ],
    'Docker Build': [
      '🐳 Building Docker image...',
      'Step 1/8 : FROM node:18-alpine',
      'Step 2/8 : WORKDIR /app',
      '✓ Docker image built successfully'
    ],
    'Security Scan': [
      '🔒 Running security scan...',
      '🔍 Scanning for vulnerabilities...',
      '✓ No critical vulnerabilities found',
      '⚠️ 2 low-severity issues detected'
    ],
    'Deploy to Staging': [
      '🚀 Deploying to staging environment...',
      '📡 Uploading artifacts...',
      '🔄 Updating deployment...',
      '✓ Deployment successful'
    ],
    'Integration Tests': [
      '🔗 Running integration tests...',
      '🌐 Testing API endpoints...',
      '🖥️ Testing UI components...',
      '✓ All integration tests passed'
    ],
    'Deploy to Production': [
      '🎯 Deploying to production...',
      '⚡ Blue-green deployment initiated...',
      '🔄 Switching traffic...',
      '✅ Production deployment complete'
    ]
  };

  useEffect(() => {
    stages.forEach(stage => {
      if (stage.status === 'running' || stage.status === 'success' || stage.status === 'failed') {
        const stageLogs = sampleLogs[stage.name as keyof typeof sampleLogs] || [`Running ${stage.name}...`];
        
        if (stage.status === 'running') {
          setLogs(prev => [...prev, `\n--- ${stage.name} ---`, ...stageLogs.slice(0, -1)]);
        } else if (stage.status === 'success') {
          setLogs(prev => [...prev, stageLogs[stageLogs.length - 1]]);
        } else if (stage.status === 'failed') {
          setLogs(prev => [...prev, `❌ ${stage.name} failed`]);
        }
      }
    });
  }, [stages]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const downloadLogs = () => {
    const element = document.createElement('a');
    const file = new Blob([logs.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `build-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className={`transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50' : 'relative'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Build Logs</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={downloadLogs}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className={`bg-slate-900 text-green-400 font-mono text-sm overflow-auto ${isExpanded ? 'h-[calc(100vh-8rem)]' : 'h-96'}`}>
        <div className="p-4">
          {logs.length === 0 ? (
            <div className="text-slate-500">
              {isRunning ? 'Pipeline starting...' : 'No logs available. Run the pipeline to see build output.'}
            </div>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className={`${log.startsWith('---') ? 'text-blue-400 font-bold mt-2' : ''} ${log.startsWith('❌') ? 'text-red-400' : ''} ${log.startsWith('✓') || log.startsWith('✅') ? 'text-green-400' : ''}`}>
                  <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </div>
              ))}
              {isRunning && (
                <div className="animate-pulse">
                  <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-yellow-400">Processing...</span>
                </div>
              )}
            </div>
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </Card>
  );
};

export default BuildLogs;
