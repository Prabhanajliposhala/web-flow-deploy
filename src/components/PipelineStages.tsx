
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, Loader2, Circle } from 'lucide-react';
import { PipelineStatus } from './PipelineDashboard';

interface PipelineStagesProps {
  stages: PipelineStatus[];
}

const PipelineStages = ({ stages }: PipelineStagesProps) => {
  const getStatusIcon = (status: PipelineStatus['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'pending':
        return <Circle className="h-5 w-5 text-slate-400" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: PipelineStatus['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      case 'running':
        return 'border-blue-200 bg-blue-50';
      case 'pending':
        return 'border-slate-200 bg-slate-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stages.map((stage, index) => (
        <Card key={stage.id} className={`p-4 transition-all duration-300 ${getStatusColor(stage.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {getStatusIcon(stage.status)}
              </div>
              <div>
                <h3 className="font-medium text-slate-800">{stage.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <span className="capitalize">{stage.status}</span>
                  {stage.duration && (
                    <>
                      <span>•</span>
                      <span>{stage.duration}s</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-lg font-bold text-slate-400">
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>
          
          {stage.status === 'running' && (
            <div className="mt-3">
              <div className="w-full bg-slate-200 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default PipelineStages;
