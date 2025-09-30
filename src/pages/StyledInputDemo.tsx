import React, { useState } from 'react';
import StyledInput from '../components/ui/StyledInput';
import Card from '../components/ui/Card';

const StyledInputDemo: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Styled Input Component Demo</h1>
          <p className="text-zinc-600 text-lg">Beautiful animated input fields with floating labels</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Examples */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-6">Basic Examples</h2>
            <div className="space-y-6">
              <StyledInput
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                name="name"
                required
              />
              
              <StyledInput
                placeholder="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                name="email"
                required
              />
              
              <StyledInput
                placeholder="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                name="phone"
              />
              
              <StyledInput
                placeholder="Company Name"
                value={formData.company}
                onChange={handleInputChange('company')}
                name="company"
              />
            </div>
          </Card>

          {/* Advanced Examples */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-6">Advanced Examples</h2>
            <div className="space-y-6">
              <StyledInput
                placeholder="Password"
                type="password"
                name="password"
                required
                autoComplete="current-password"
              />
              
              <StyledInput
                placeholder="Website URL"
                type="url"
                name="website"
                pattern="https?://.*"
              />
              
              <StyledInput
                placeholder="Age"
                type="number"
                name="age"
                minLength={1}
                maxLength={3}
              />
              
              <StyledInput
                placeholder="Disabled Field"
                value="This field is disabled"
                disabled
                name="disabled"
              />
            </div>
          </Card>
        </div>

        {/* Form Data Display */}
        <Card className="p-8 mt-8">
          <h2 className="text-2xl font-semibold text-zinc-900 mb-6">Form Data</h2>
          <pre className="bg-zinc-100 p-4 rounded-lg overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </Card>

        {/* Usage Instructions */}
        <Card className="p-8 mt-8">
          <h2 className="text-2xl font-semibold text-zinc-900 mb-6">Usage Instructions</h2>
          <div className="prose max-w-none">
            <p className="text-zinc-700 mb-4">
              The StyledInput component provides a beautiful animated input field with floating labels. 
              Here's how to use it:
            </p>
            <div className="bg-zinc-100 p-4 rounded-lg">
              <pre className="text-sm">
{`import StyledInput from '../components/ui/StyledInput';

<StyledInput
  placeholder="Your placeholder text"
  value={value}
  onChange={handleChange}
  name="fieldName"
  type="text" // or email, password, tel, url, number
  required={true}
  disabled={false}
  maxLength={100}
  autoComplete="email"
/>`}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StyledInputDemo;
