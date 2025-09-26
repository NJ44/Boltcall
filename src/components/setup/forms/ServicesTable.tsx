import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Button from '../../ui/Button';

interface Service {
  name: string;
  duration: number;
  price: number;
}

interface ServicesTableProps {
  services: Service[];
  onChange: (services: Service[]) => void;
  className?: string;
}

const ServicesTable: React.FC<ServicesTableProps> = ({
  services,
  onChange,
  className = '',
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newService, setNewService] = useState<Service>({ name: '', duration: 60, price: 0 });

  const handleAddService = () => {
    if (newService.name.trim()) {
      onChange([...services, newService]);
      setNewService({ name: '', duration: 60, price: 0 });
    }
  };

  const handleUpdateService = (index: number, service: Service) => {
    const updated = [...services];
    updated[index] = service;
    onChange(updated);
    setEditingIndex(null);
  };

  const handleDeleteService = (index: number) => {
    const updated = services.filter((_, i) => i !== index);
    onChange(updated);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Services</h3>
        <span className="text-sm text-gray-500">{services.length} services</span>
      </div>

      {/* Services List */}
      <div className="space-y-2">
        <AnimatePresence>
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              {editingIndex === index ? (
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => {
                      const updated = { ...service, name: e.target.value };
                      handleUpdateService(index, updated);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                    placeholder="Service name"
                  />
                  <input
                    type="number"
                    value={service.duration}
                    onChange={(e) => {
                      const updated = { ...service, duration: parseInt(e.target.value) || 0 };
                      handleUpdateService(index, updated);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                    placeholder="Duration (minutes)"
                    min="1"
                  />
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) => {
                      const updated = { ...service, price: parseFloat(e.target.value) || 0 };
                      handleUpdateService(index, updated);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                    placeholder="Price"
                    min="0"
                    step="0.01"
                  />
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{service.name}</p>
                  </div>
                  <div className="w-24 text-center">
                    <p className="text-sm text-gray-600">{formatDuration(service.duration)}</p>
                  </div>
                  <div className="w-24 text-center">
                    <p className="text-sm text-gray-600">{formatPrice(service.price)}</p>
                  </div>
                </>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                  className="p-1 text-gray-400 hover:text-brand-blue transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteService(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {services.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No services added yet.</p>
            <p className="text-sm">Add your first service below.</p>
          </div>
        )}
      </div>

      {/* Add New Service */}
      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              placeholder="e.g., Consultation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={newService.duration}
              onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              placeholder="60"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              placeholder="100.00"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Button
              onClick={handleAddService}
              disabled={!newService.name.trim()}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Add Presets */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600 mb-3">Quick add common services:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Consultation', duration: 60, price: 150 },
            { name: 'Follow-up', duration: 30, price: 75 },
            { name: 'Emergency Visit', duration: 90, price: 250 },
            { name: 'Phone Consultation', duration: 15, price: 50 },
          ].map((preset, index) => (
            <button
              key={index}
              onClick={() => onChange([...services, preset])}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesTable;

