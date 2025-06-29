
import React, { useState, useEffect } from 'react';
import PipelineStages from './PipelineStages';
import WorkflowConfig from './WorkflowConfig';
import BuildLogs from './BuildLogs';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, RefreshCw } from 'lucide-react';

export interface PipelineStatus {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
  startTime?: Date;
  duration?: number;
}

const PipelineDashboard = () => {
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [stages, setStages] = useState<PipelineStatus[]>([
    { id: '1', name: 'Code Checkout', status: 'pending' },
    { id: '2', name: 'Install Dependencies', status: 'pending' },
    { id: '3', name: 'Run Tests', status: 'pending' },
    { id: '4', name: 'Build Application', status: 'pending' },
    { id: '5', name: 'Docker Build', status: 'pending' },
    { id: '6', name: 'Security Scan', status: 'pending' },
    { id: '7', name: 'Deploy to Staging', status: 'pending' },
    { id: '8', name: 'Integration Tests', status: 'pending' },
    { id: '9', name: 'Deploy to Production', status: 'pending' },
  ]);

  useEffect(() => {
    console.log('PipelineDashboard component mounted');
    console.log('Pipeline running state:', pipelineRunning);
  }, []);

  const runPipeline = () => {
    console.log('Run Pipeline button clicked!');
    if (pipelineRunning) return;
    
    setPipelineRunning(true);
    setStages(stages.map(stage => ({ ...stage, status: 'pending' as const })));
    
    // Simulate pipeline execution
    let currentStageIndex = 0;
    const runNextStage = () => {
      if (currentStageIndex >= stages.length) {
        setPipelineRunning(false);
        return;
      }
      
      setStages(prev => prev.map((stage, index) => {
        if (index === currentStageIndex) {
          return { ...stage, status: 'running' as const, startTime: new Date() };
        }
        return stage;
      }));
      
      // Simulate stage duration
      const duration = Math.random() * 3000 + 1000; // 1-4 seconds
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        setStages(prev => prev.map((stage, index) => {
          if (index === currentStageIndex) {
            return { 
              ...stage, 
              status: success ? 'success' as const : 'failed' as const,
              duration: Math.floor(duration / 1000)
            };
          }
          return stage;
        }));
        
        if (success) {
          currentStageIndex++;
          setTimeout(runNextStage, 500);
        } else {
          setPipelineRunning(false);
        }
      }, duration);
    };
    
    runNextStage();
  };

  const resetPipeline = () => {
    console.log('Reset Pipeline button clicked!');
    setPipelineRunning(false);
    setStages(stages.map(stage => ({ ...stage, status: 'pending' as const, startTime: undefined, duration: undefined })));
  };

  console.log('Rendering PipelineDashboard, pipelineRunning:', pipelineRunning);

  return (
    <div className="space-y-6">
      <Card className="p-6 border-2 border-blue-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Pipeline Status</h2>
            <p className="text-slate-600">Web App Deployment Pipeline</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={runPipeline}
              disabled={pipelineRunning}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 text-lg shadow-lg"
              size="lg"
            >
              {pipelineRunning ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Running Pipeline...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  🚀 Run Pipeline
                </>
              )}
            </Button>
            <Button 
              onClick={resetPipeline}
              variant="outline"
              disabled={pipelineRunning}
              className="font-semibold py-3 px-6"
              size="lg"
            >
              Reset
            </Button>
          </div>
        </div>
        
        <PipelineStages stages={stages} />
      </Card>

      <Tabs defaultValue="workflow" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflow">Workflow Config</TabsTrigger>
          <TabsTrigger value="docker">Docker Config</TabsTrigger>
          <TabsTrigger value="logs">Build Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workflow" className="space-y-4">
          <WorkflowConfig />
        </TabsContent>
        
        <TabsContent value="docker" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Dockerfile Configuration</h3>
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}</pre>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <BuildLogs stages={stages} isRunning={pipelineRunning} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PipelineDashboard;
