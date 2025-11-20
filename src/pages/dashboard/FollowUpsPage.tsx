import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';
import FeatureOnboarding from '../../components/dashboard/FeatureOnboarding';

const FollowUpsPage: React.FC = () => {
  const [followUps, setFollowUps] = useState<any[]>([]);

  return (
    <FeatureOnboarding
      featureKey="followUps"
      icon={RotateCw}
      title="Follow Ups"
      description="Automate your follow-up communications to keep conversations warm and nurture leads. Set up automated follow-up sequences that engage your clients at the right time."
      onActivate={() => {
        // Optional: Add any specific activation logic here if needed
        // For now, just marking as activated in localStorage is enough
      }}
    >
      <div className="space-y-6">
        {/* Follow Ups Configuration */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <RotateCw className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Follow Ups Configuration</h2>
              <p className="text-sm text-gray-600">Configure your automated follow-up sequences</p>
            </div>
          </div>

          <div className="text-center py-12 text-gray-500">
            <RotateCw className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No follow-ups configured yet</p>
            <p className="text-sm">Set up your first follow-up sequence to start engaging with your leads automatically.</p>
          </div>
        </div>
      </div>
    </FeatureOnboarding>
  );
};

export default FollowUpsPage;

