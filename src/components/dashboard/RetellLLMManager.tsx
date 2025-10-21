import React, { useState, useEffect } from 'react';
import type { RetellLLM, RetellLLMConfig } from '../../types/retell';
import { INDUSTRY_PRESETS } from '../../types/retell';
import { RetellLLMService } from '../../lib/retellLLM';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface RetellLLMManagerProps {
  workspaceId: string;
}

const RetellLLMManager: React.FC<RetellLLMManagerProps> = ({ workspaceId }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [llms, setLLMs] = useState<RetellLLM[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLLM, setEditingLLM] = useState<RetellLLM | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    system_prompt: '',
    voice_id: '',
    is_public: false
  });

  useEffect(() => {
    if (user && workspaceId) {
      fetchLLMs();
    }
  }, [user, workspaceId]);

  const fetchLLMs = async () => {
    try {
      setLoading(true);
      const data = await RetellLLMService.getWorkspaceLLMs(workspaceId);
      setLLMs(data);
    } catch (error) {
      console.error('Error fetching LLMs:', error);
      showToast({ message: 'Failed to load LLMs', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLLM = async () => {
    if (!user) return;

    try {
      const preset = INDUSTRY_PRESETS[formData.industry] || {};
      const customConfig: Partial<RetellLLMConfig> = {
        system_prompt: formData.system_prompt || preset.system_prompt,
        ...preset
      };

      await RetellLLMService.createLLM(
        formData.name,
        formData.industry,
        workspaceId,
        user.id,
        customConfig,
        formData.voice_id || undefined
      );

      showToast({ message: 'LLM created successfully', variant: 'success' });
      setIsCreateModalOpen(false);
      resetForm();
      fetchLLMs();
    } catch (error) {
      console.error('Error creating LLM:', error);
      showToast({ message: 'Failed to create LLM', variant: 'error' });
    }
  };

  const handleEditLLM = async () => {
    if (!editingLLM) return;

    try {
      await RetellLLMService.updateLLM(editingLLM.id, {
        name: formData.name,
        description: formData.description,
        is_public: formData.is_public,
        voice_id: formData.voice_id || undefined
      });

      showToast({ message: 'LLM updated successfully', variant: 'success' });
      setIsEditModalOpen(false);
      setEditingLLM(null);
      resetForm();
      fetchLLMs();
    } catch (error) {
      console.error('Error updating LLM:', error);
      showToast({ message: 'Failed to update LLM', variant: 'error' });
    }
  };

  const handleDeleteLLM = async (id: string) => {
    try {
      await RetellLLMService.deleteLLM(id);
      showToast({ message: 'LLM deleted successfully', variant: 'success' });
      fetchLLMs();
    } catch (error) {
      console.error('Error deleting LLM:', error);
      showToast({ message: 'Failed to delete LLM', variant: 'error' });
    }
  };

  const handleTogglePublic = async (llm: RetellLLM) => {
    try {
      await RetellLLMService.updateLLM(llm.id, {
        is_public: !llm.is_public
      });
      showToast({ message: `LLM ${!llm.is_public ? 'made public' : 'made private'}`, variant: 'success' });
      fetchLLMs();
    } catch (error) {
      console.error('Error toggling public status:', error);
      showToast({ message: 'Failed to update LLM visibility', variant: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      industry: '',
      system_prompt: '',
      voice_id: '',
      is_public: false
    });
  };

  const openEditModal = (llm: RetellLLM) => {
    setEditingLLM(llm);
    setFormData({
      name: llm.name,
      description: llm.description || '',
      industry: llm.industry,
      system_prompt: llm.llm_config.system_prompt,
      voice_id: llm.voice_id || '',
      is_public: llm.is_public
    });
    setIsEditModalOpen(true);
  };

  const filteredLLMs = llms.filter(llm => {
    const matchesSearch = llm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (llm.description && llm.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesIndustry = !selectedIndustry || llm.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Retell LLMs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border-2 border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Retell LLMs</h2>
          <p className="text-gray-600">Manage your AI voice assistant configurations</p>
        </div>
        
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create LLM
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search LLMs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Industries</SelectItem>
            <SelectItem value="dentist">Dentist</SelectItem>
            <SelectItem value="hvac">HVAC</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* LLM Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLLMs.map((llm) => (
          <Card key={llm.id} className="hover:shadow-lg transition-shadow p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{llm.name}</h3>
                  <p className="text-sm text-gray-600">{llm.description}</p>
                </div>
                <Badge variant={llm.is_public ? "default" : "secondary"}>
                  {llm.industry}
                </Badge>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Usage: {llm.usage_count}</span>
                <span className={`flex items-center gap-1 ${llm.is_public ? 'text-green-600' : 'text-gray-500'}`}>
                  {llm.is_public ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {llm.is_public ? 'Public' : 'Private'}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditModal(llm)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTogglePublic(llm)}
                >
                  {llm.is_public ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteLLM(llm.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredLLMs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No LLMs found matching your criteria</p>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create New Retell LLM</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Dental Practice Assistant"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this LLM's purpose"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dentist">Dentist</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.system_prompt}
                  onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                  placeholder="Customize the AI's behavior and responses"
                  rows={4}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="is_public" className="text-sm font-medium text-gray-700">
                  Make this LLM public for others to use
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateLLM}>
                Create LLM
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingLLM && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Retell LLM</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.system_prompt}
                  onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                  rows={4}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-is-public"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="edit-is-public" className="text-sm font-medium text-gray-700">
                  Make this LLM public for others to use
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditLLM}>
                Update LLM
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetellLLMManager;