import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Clock, CheckCircle, Mail, Download, Phone, Zap } from 'lucide-react';
import Confetti from 'react-confetti';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import { Stepper, StepperPanel, StepperContent } from '../components/ui/stepper';
import Button from '../components/ui/Button';

interface AuditInputs {
  // Step A - Business Profile
  industry: string;
  whoTalksWithCustomers: string;
  
  // Step B - Current Performance
  avgMonthlyLeads: number;
  avgLeadToBookingRate: number; // percentage
  avgBookingValue: number;
  avgMonthlyPhoneCalls: number;
  avgMissedCallRate: number; // percentage
  avgFollowUpRate: number; // percentage
  avgCustomerLifetimeValue: number;
  
  // Step C - Costs & Staffing
  hourlySalaryReceptionist: number;
  monthlyReceptionistHours: number;
  monthlyToolSpend: number;
  
  // Step D - Preferences
  expectedAiCaptureRate: number; // percentage
  automationTargetFollowUps: number; // percentage
  monthlyAiSubscription: number;
  
  // Contact
  contactEmail: string;
  contactPhone: string;
}

interface AuditResults {
  baseline: {
    bookingsPerMonth: number;
    monthlyRevenue: number;
  };
  recovery: {
    missedLeads: number;
    recoveredLeads: number;
    recoveredBookings: number;
    recoveredRevenue: number;
  };
  followUp: {
    addedBookings: number;
    addedRevenue: number;
  };
  savings: {
    staffingSavings: number;
  };
  totals: {
    monthlyUplift: number;
    annualUplift: number;
    monthlyNetGain: number;
    paybackMonths: number;
  };
  assumptions: {
    aiCaptureRate: number;
    followUpUpliftPct: number;
    staffingReductionPct: number;
  };
}

const industries = [
  'Dentist',
  'HVAC',
  'Plumber',
  'Salon',
  'Clinic',
  'Real Estate',
  'Contractor',
  'Retail',
  'Auto Repair',
  'Legal',
  'Other'
];

const AIRevenueAudit: React.FC = () => {
  const [surveyStarted, setSurveyStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [noReceptionist, setNoReceptionist] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  const [inputs, setInputs] = useState<AuditInputs>({
    industry: '',
    whoTalksWithCustomers: '',
    avgMonthlyLeads: 200,
    avgLeadToBookingRate: 10,
    avgBookingValue: 150,
    avgMonthlyPhoneCalls: 200,
    avgMissedCallRate: 25,
    avgFollowUpRate: 40,
    avgCustomerLifetimeValue: 450,
    hourlySalaryReceptionist: 30,
    monthlyReceptionistHours: 160,
    monthlyToolSpend: 0,
    expectedAiCaptureRate: 70,
    automationTargetFollowUps: 80,
    monthlyAiSubscription: 79,
    contactEmail: '',
    contactPhone: ''
  });

  // Set window size for confetti
  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show confetti when email is sent
  useEffect(() => {
    if (emailSent) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [emailSent]);

  const calculateAudit = (): AuditResults => {
    // Variables
    const L = inputs.avgMonthlyLeads;
    const B = inputs.avgLeadToBookingRate / 100; // Convert to decimal
    const V = inputs.avgBookingValue;
    const MCR = inputs.avgMissedCallRate / 100;
    const AiCapture = inputs.expectedAiCaptureRate / 100;
    const FollowUp = inputs.automationTargetFollowUps / 100;
    const Salary = inputs.hourlySalaryReceptionist;
    const Hours = inputs.monthlyReceptionistHours;
    const AiCost = inputs.monthlyAiSubscription;
    const CurrentTool = inputs.monthlyToolSpend;
    
    // Baseline
    const bookingsPerMonth = L * B;
    const monthlyRevenue = bookingsPerMonth * V;
    
    // Missed leads & recovery
    const missedLeads = L * MCR;
    const recoveredLeads = missedLeads * AiCapture;
    const recoveredBookings = recoveredLeads * B;
    const recoveredRevenue = recoveredBookings * V;
    
    // Follow-up automation uplift
    // Conservative: automation can increase conversion on followed up leads by 30%
    const followUpUpliftPct = 0.3;
    const addedBookings = L * FollowUp * (B * followUpUpliftPct);
    const addedRevenue = addedBookings * V;
    
    // Cost savings
    const staffingReductionPct = 0.5; // 50% reduction
    const staffingSavings = Salary * (Hours * staffingReductionPct);
    
    // Totals
    const monthlyUplift = recoveredRevenue + addedRevenue + staffingSavings - AiCost + CurrentTool;
    const annualUplift = monthlyUplift * 12;
    const monthlyNetGain = monthlyUplift;
    const paybackMonths = annualUplift > 0 ? (AiCost * 12) / annualUplift : 0;
    
    return {
      baseline: {
        bookingsPerMonth: Math.round(bookingsPerMonth),
        monthlyRevenue: Math.round(monthlyRevenue)
      },
      recovery: {
        missedLeads: Math.round(missedLeads),
        recoveredLeads: Math.round(recoveredLeads),
        recoveredBookings: Math.round(recoveredBookings),
        recoveredRevenue: Math.round(recoveredRevenue)
      },
      followUp: {
        addedBookings: Math.round(addedBookings),
        addedRevenue: Math.round(addedRevenue)
      },
      savings: {
        staffingSavings: Math.round(staffingSavings)
      },
      totals: {
        monthlyUplift: Math.round(monthlyUplift),
        annualUplift: Math.round(annualUplift),
        monthlyNetGain: Math.round(monthlyNetGain),
        paybackMonths: paybackMonths > 0 ? Number(paybackMonths.toFixed(1)) : 0
      },
      assumptions: {
        aiCaptureRate: AiCapture,
        followUpUpliftPct: followUpUpliftPct,
        staffingReductionPct: staffingReductionPct
      }
    };
  };

  const results = calculateAudit();

  const handleInputChange = (field: keyof AuditInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateAudit();
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitAudit = async () => {
    if (!inputs.contactEmail) {
      alert('Please enter your email to receive the full audit');
      return;
    }

    setIsSubmitting(true);
    
    // Here you would call your API endpoint to generate and send the PDF
    // For now, we'll simulate it
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, call: POST /api/audit/send
      // with inputs and results
      
      setEmailSent(true);
    } catch (error) {
      console.error('Error sending audit:', error);
      alert('There was an error sending your audit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
      <GiveawayBar />
      <Header />
      
      {/* Hero Section */}
      {!surveyStarted ? (
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                How Much Can You <span className="text-blue-600">Earn</span> with AI?
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Get a personalized audit showing your potential revenue increase and cost savings with Boltcall's AI services.
              </p>
              
              <Button
                onClick={() => setSurveyStarted(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
              >
                Start
              </Button>
            </motion.div>
          </div>
        </section>
      ) : (
        <>
          {/* Progress Bar */}
          <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Step Titles Above Progress Bar */}
              <div className="mb-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className={`text-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className="text-sm font-semibold mb-1">1</div>
                    <div className="text-sm font-medium">Business Profile</div>
                    <div className="text-xs text-gray-500 mt-1">Tell us about your business</div>
                  </div>
                  <div className={`text-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className="text-sm font-semibold mb-1">2</div>
                    <div className="text-sm font-medium">Current Performance</div>
                    <div className="text-xs text-gray-500 mt-1">Your current lead and booking metrics</div>
                  </div>
                  <div className={`text-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className="text-sm font-semibold mb-1">3</div>
                    <div className="text-sm font-medium">Costs & Staffing</div>
                    <div className="text-xs text-gray-500 mt-1">Your current operational costs</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    Step {currentStep} of 3
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round((currentStep / 3) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <motion.div
                    className="bg-blue-600 h-1 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / 3) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Form Section */}
          {!showResults && (
            <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
              <div className="max-w-4xl mx-auto">
                <Stepper
                  defaultValue={currentStep}
                  value={currentStep}
                  onValueChange={setCurrentStep}
                  orientation="vertical"
                >
              <StepperPanel>
                <StepperContent value={1}>
                  <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Business Profile</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                        <select
                          value={inputs.industry}
                          onChange={(e) => handleInputChange('industry', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          required
                        >
                          <option value="">Select your industry</option>
                          {industries.map(industry => (
                            <option key={industry} value={industry} className="text-gray-900">{industry}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Who talks with the customers</label>
                        <select
                          value={inputs.whoTalksWithCustomers}
                          onChange={(e) => handleInputChange('whoTalksWithCustomers', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        >
                          <option value="">Select an option</option>
                          <option value="me" className="text-gray-900">Me</option>
                          <option value="i-have-a-receptionist" className="text-gray-900">I have a receptionist</option>
                          <option value="team-members" className="text-gray-900">Team members</option>
                          <option value="mixed" className="text-gray-900">Mixed (me and others)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </StepperContent>

                <StepperContent value={2}>
                  <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Current Performance</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Average Monthly Leads</label>
                        <input
                          type="number"
                          value={inputs.avgMonthlyLeads}
                          onChange={(e) => handleInputChange('avgMonthlyLeads', parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Total inbound leads per month (calls + forms)</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Lead to Booking Rate (%)</label>
                          <input
                            type="number"
                            value={inputs.avgLeadToBookingRate}
                            onChange={(e) => handleInputChange('avgLeadToBookingRate', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            step="0.1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Average Booking Value</label>
                          <input
                            type="number"
                            value={inputs.avgBookingValue}
                            onChange={(e) => handleInputChange('avgBookingValue', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Average Monthly Phone Calls</label>
                        <input
                          type="number"
                          value={inputs.avgMonthlyPhoneCalls}
                          onChange={(e) => handleInputChange('avgMonthlyPhoneCalls', parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Missed Call Rate (%)</label>
                          <input
                            type="number"
                            value={inputs.avgMissedCallRate}
                            onChange={(e) => handleInputChange('avgMissedCallRate', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            step="0.1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Rate (%)</label>
                          <input
                            type="number"
                            value={inputs.avgFollowUpRate}
                            onChange={(e) => handleInputChange('avgFollowUpRate', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            step="0.1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Customer Lifetime Value (Optional)</label>
                        <input
                          type="number"
                          value={inputs.avgCustomerLifetimeValue}
                          onChange={(e) => handleInputChange('avgCustomerLifetimeValue', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty to auto-calculate (Booking Value × 3)</p>
                      </div>
                    </div>
                  </div>
                </StepperContent>

                <StepperContent value={3}>
                  <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Costs & Staffing</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <input
                          type="checkbox"
                          id="noReceptionist"
                          checked={noReceptionist}
                          onChange={(e) => {
                            setNoReceptionist(e.target.checked);
                            if (e.target.checked) {
                              handleInputChange('hourlySalaryReceptionist', 0);
                              handleInputChange('monthlyReceptionistHours', 0);
                            }
                          }}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="noReceptionist" className="text-sm font-medium text-gray-700 cursor-pointer">
                          I do all the calls, I don't have a receptionist
                        </label>
                      </div>
                      {!noReceptionist && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Salary (Receptionist)</label>
                            <input
                              type="number"
                              value={inputs.hourlySalaryReceptionist}
                              onChange={(e) => handleInputChange('hourlySalaryReceptionist', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Receptionist Hours</label>
                            <input
                              type="number"
                              value={inputs.monthlyReceptionistHours}
                              onChange={(e) => handleInputChange('monthlyReceptionistHours', parseInt(e.target.value) || 0)}
                              min="0"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Tool Spend (Optional)</label>
                        <input
                          type="number"
                          value={inputs.monthlyToolSpend}
                          onChange={(e) => handleInputChange('monthlyToolSpend', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Current software costs for call handling</p>
                      </div>
                    </div>
                  </div>
                </StepperContent>

              </StepperPanel>

              <div className="flex justify-between mt-8">
                <Button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {currentStep === 3 ? 'Calculate Results' : 'Next'}
                </Button>
              </div>
            </Stepper>
          </div>
        </section>
        )}

        {/* Results Section */}
        {showResults && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Instant Summary */}
              <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-white mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">Your AI Revenue Audit Results</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-6 h-6" />
                      <span className="text-blue-100 text-sm">Monthly Revenue Increase</span>
                    </div>
                    <p className="text-4xl font-bold">{formatCurrency(results.totals.monthlyUplift)}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="w-6 h-6" />
                      <span className="text-blue-100 text-sm">Monthly Net Gain</span>
                    </div>
                    <p className="text-4xl font-bold">{formatCurrency(results.totals.monthlyNetGain)}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-6 h-6" />
                      <span className="text-blue-100 text-sm">Payback Period</span>
                    </div>
                    <p className="text-4xl font-bold">{results.totals.paybackMonths} months</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-6 h-6" />
                      <span className="text-blue-100 text-sm">Additional Bookings/Month</span>
                    </div>
                    <p className="text-4xl font-bold">
                      {results.recovery.recoveredBookings + results.followUp.addedBookings}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6" />
                    <span className="text-blue-100 text-sm font-semibold">Annual Revenue Uplift</span>
                  </div>
                  <p className="text-5xl font-bold">{formatCurrency(results.totals.annualUplift)}</p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Breakdown</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Baseline Metrics</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Current Bookings/Month</p>
                        <p className="text-2xl font-bold text-gray-900">{results.baseline.bookingsPerMonth}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Current Monthly Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(results.baseline.monthlyRevenue)}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Recovered Revenue from Missed Leads</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {results.recovery.missedLeads} missed leads × {Math.round(results.assumptions.aiCaptureRate * 100)}% capture rate = {results.recovery.recoveredLeads} recovered leads
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {results.recovery.recoveredLeads} recovered leads × {inputs.avgLeadToBookingRate}% conversion = {results.recovery.recoveredBookings} additional bookings
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        +{formatCurrency(results.recovery.recoveredRevenue)}/month
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Follow-up Automation Uplift</h4>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Automated follow-ups increase conversion by 30% on followed-up leads
                      </p>
                      <p className="text-xl font-bold text-green-600">
                        +{formatCurrency(results.followUp.addedRevenue)}/month
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Cost Savings</h4>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">
                        AI reduces receptionist hours by {Math.round(results.assumptions.staffingReductionPct * 100)}%
                      </p>
                      <p className="text-xl font-bold text-purple-600">
                        +{formatCurrency(results.savings.staffingSavings)}/month savings
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assumptions */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Assumptions</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• AI capture rate: {Math.round(results.assumptions.aiCaptureRate * 100)}%</li>
                  <li>• Follow-up conversion uplift: {Math.round(results.assumptions.followUpUpliftPct * 100)}%</li>
                  <li>• Staffing reduction: {Math.round(results.assumptions.staffingReductionPct * 100)}%</li>
                  <li>• AI subscription cost: {formatCurrency(inputs.monthlyAiSubscription)}/month</li>
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommended Next Steps</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Enable AI Receptionist</h4>
                      <p className="text-gray-600">Answer calls 24/7 and never miss a lead</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Setup SMS Follow-ups</h4>
                      <p className="text-gray-600">Automate follow-ups for all new leads</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Install Website Widget</h4>
                      <p className="text-gray-600">Capture leads from your website instantly</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Capture for Full Audit */}
              {!emailSent ? (
                <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Get Your Full Personalized Audit</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Receive a detailed PDF audit with personalized recommendations, charts, and a 30-day implementation plan.
                  </p>
                  <div className="space-y-4">
                    <input
                      type="email"
                      value={inputs.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="Enter your email for the full audit"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button
                      onClick={handleSubmitAudit}
                      disabled={isSubmitting || !inputs.contactEmail}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Send Me the Full Audit (PDF)
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Audit Sent!</h3>
                  <p className="text-gray-600 mb-6">
                    Check your email ({inputs.contactEmail}) for your personalized PDF audit.
                  </p>
                  {results.totals.annualUplift > 10000 && (
                    <Button
                      onClick={() => window.location.href = '/setup'}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 mx-auto"
                    >
                      <Phone className="w-5 h-5" />
                      Book a Free 15-Minute Setup Call
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </section>
        )}
        </>
      )}

      <Footer />
    </div>
  );
};

export default AIRevenueAudit;

