import React, { useState, useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import { Stepper, StepperPanel, StepperContent } from '../components/ui/stepper';
import Button from '../components/ui/Button';
import DropdownComponent from '../components/ui/dropdown-01';
import { useNavigate } from 'react-router-dom';

interface AuditInputs {
  // Step 1 - Lead Friction Category
  responseTimeToInquiry: string; // < 5 mins, 30 mins, 2 hours, Next day, We often miss them
  afterHoursCallHandling: string; // Goes to voicemail, We miss them, Someone answers eventually
  
  // Step 2 - Time Leakage Category
  adminPingPongHours: string; // 0-5, 5-10, 10-20, 20+
  automatedFollowUpSystem: string; // Yes, No, We try to do it manually
  
  // Step 3 - Financial Data Points
  avgCustomerLifetimeValue: number; // LTV
  avgMonthlyLeads: number;
  avgLeadToBookingRate: number; // percentage
  
  // Internal calculation fields (derived from above)
  avgBookingValue: number; // Calculated from LTV
  avgMonthlyPhoneCalls: number; // Estimated
  avgMissedCallRate: number; // Derived from responseTimeToInquiry and afterHoursCallHandling
  avgFollowUpRate: number; // Derived from automatedFollowUpSystem
  hourlySalaryReceptionist: number; // Estimated
  monthlyReceptionistHours: number; // Derived from adminPingPongHours
  monthlyToolSpend: number;
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
    monthlyHoursSaved: number;
  };
  assumptions: {
    aiCaptureRate: number;
    followUpUpliftPct: number;
    staffingReductionPct: number;
  };
}

// Dropdown options
const responseTimeOptions = [
  { value: '< 5 mins', label: '< 5 mins' },
  { value: '30 mins', label: '30 mins' },
  { value: '2 hours', label: '2 hours' },
  { value: 'Next day', label: 'Next day' },
  { value: 'We often miss them', label: 'We often miss them' },
];

const afterHoursOptions = [
  { value: 'Goes to voicemail', label: 'Goes to voicemail' },
  { value: 'We miss them', label: 'We miss them' },
  { value: 'Someone answers eventually', label: 'Someone answers eventually' },
];

const adminPingPongOptions = [
  { value: '0-5', label: '0-5' },
  { value: '5-10', label: '5-10' },
  { value: '10-20', label: '10-20' },
  { value: '20+', label: '20+' },
];

const automatedFollowUpOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
  { value: 'We try to do it manually', label: 'We try to do it manually' },
];

const AIRevenueAudit: React.FC = () => {
  useEffect(() => {
    document.title = 'AI Revenue Audit Calculator - Calculate Earnings | Boltcall';
    updateMetaDescription('AI revenue audit calculator: calculate your potential earnings with AI receptionist. Free revenue analysis tool. Try now.');
  }, []);
  const [surveyStarted, setSurveyStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const [inputs, setInputs] = useState<AuditInputs>({
    // Step 1 - Lead Friction
    responseTimeToInquiry: '',
    afterHoursCallHandling: '',
    
    // Step 2 - Time Leakage
    adminPingPongHours: '',
    automatedFollowUpSystem: '',
    
    // Step 3 - Financial Data Points
    avgCustomerLifetimeValue: 450,
    avgMonthlyLeads: 200,
    avgLeadToBookingRate: 10,
    
    // Internal calculation fields
    avgBookingValue: 150,
    avgMonthlyPhoneCalls: 200,
    avgMissedCallRate: 25,
    avgFollowUpRate: 40,
    hourlySalaryReceptionist: 30,
    monthlyReceptionistHours: 160,
    monthlyToolSpend: 0,
    expectedAiCaptureRate: 70,
    automationTargetFollowUps: 80,
    monthlyAiSubscription: 79,
    contactEmail: '',
    contactPhone: ''
  });


  // Derive calculation fields from user inputs
  const deriveCalculationFields = () => {
    const derived = { ...inputs };
    
    // Calculate avgBookingValue from LTV (assume LTV is 3x booking value)
    if (inputs.avgCustomerLifetimeValue > 0) {
      derived.avgBookingValue = inputs.avgCustomerLifetimeValue / 3;
    } else if (!derived.avgBookingValue || derived.avgBookingValue === 0) {
      derived.avgBookingValue = 150; // Default fallback
    }
    
    // Estimate missed call rate from response time (default to 25% if not set)
    let baseMissedCallRate = 25;
    if (inputs.responseTimeToInquiry === '< 5 mins') {
      baseMissedCallRate = 5;
    } else if (inputs.responseTimeToInquiry === '30 mins') {
      baseMissedCallRate = 15;
    } else if (inputs.responseTimeToInquiry === '2 hours') {
      baseMissedCallRate = 40; // 80% drop mentioned in logic
    } else if (inputs.responseTimeToInquiry === 'Next day') {
      baseMissedCallRate = 60;
    } else if (inputs.responseTimeToInquiry === 'We often miss them') {
      baseMissedCallRate = 80;
    }
    derived.avgMissedCallRate = baseMissedCallRate;
    
    // Adjust missed call rate based on after-hours handling
    if (inputs.afterHoursCallHandling === 'We miss them') {
      derived.avgMissedCallRate = Math.min(100, baseMissedCallRate + 20);
    } else if (inputs.afterHoursCallHandling === 'Goes to voicemail') {
      derived.avgMissedCallRate = Math.min(100, baseMissedCallRate + 10);
    }
    
    // Estimate follow-up rate from automated system
    if (inputs.automatedFollowUpSystem === 'Yes') {
      derived.avgFollowUpRate = 70;
      derived.automationTargetFollowUps = 90;
    } else if (inputs.automatedFollowUpSystem === 'We try to do it manually') {
      derived.avgFollowUpRate = 40;
      derived.automationTargetFollowUps = 80;
    } else if (inputs.automatedFollowUpSystem === 'No') {
      derived.avgFollowUpRate = 10;
      derived.automationTargetFollowUps = 80;
    } else {
      // Default values if not set
      derived.avgFollowUpRate = derived.avgFollowUpRate || 40;
      derived.automationTargetFollowUps = derived.automationTargetFollowUps || 80;
    }
    
    // Estimate monthly receptionist hours from admin ping-pong hours
    if (inputs.adminPingPongHours === '0-5') {
      derived.monthlyReceptionistHours = 20; // ~5 hours/week * 4 weeks
    } else if (inputs.adminPingPongHours === '5-10') {
      derived.monthlyReceptionistHours = 60; // ~7.5 hours/week * 4 weeks
    } else if (inputs.adminPingPongHours === '10-20') {
      derived.monthlyReceptionistHours = 120; // ~15 hours/week * 4 weeks
    } else if (inputs.adminPingPongHours === '20+') {
      derived.monthlyReceptionistHours = 160; // ~20+ hours/week * 4 weeks
    } else if (!derived.monthlyReceptionistHours || derived.monthlyReceptionistHours === 0) {
      derived.monthlyReceptionistHours = 160; // Default fallback
    }
    
    // Estimate phone calls (assume 50% of leads are calls)
    derived.avgMonthlyPhoneCalls = Math.round((inputs.avgMonthlyLeads || 200) * 0.5);
    
    // Ensure other required fields have defaults
    if (!derived.hourlySalaryReceptionist || derived.hourlySalaryReceptionist === 0) {
      derived.hourlySalaryReceptionist = 30; // Default fallback
    }
    if (!derived.expectedAiCaptureRate || derived.expectedAiCaptureRate === 0) {
      derived.expectedAiCaptureRate = 70; // Default fallback
    }
    if (!derived.monthlyAiSubscription || derived.monthlyAiSubscription === 0) {
      derived.monthlyAiSubscription = 79; // Default fallback
    }
    
    return derived;
  };

  const calculateAudit = (): AuditResults => {
    const calcInputs = deriveCalculationFields();
    
    // Variables
    const L = calcInputs.avgMonthlyLeads;
    const B = calcInputs.avgLeadToBookingRate / 100; // Convert to decimal
    const V = calcInputs.avgBookingValue;
    const MCR = calcInputs.avgMissedCallRate / 100;
    const AiCapture = calcInputs.expectedAiCaptureRate / 100;
    const FollowUp = calcInputs.automationTargetFollowUps / 100;
    const Salary = calcInputs.hourlySalaryReceptionist;
    const Hours = calcInputs.monthlyReceptionistHours;
    const AiCost = calcInputs.monthlyAiSubscription;
    const CurrentTool = calcInputs.monthlyToolSpend;
    
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
    
    // Calculate total hours saved per month
    // 1. Receptionist/admin hours saved (from admin ping-pong automation)
    const adminHoursSaved = Hours * staffingReductionPct;
    
    // 2. AI Receptionist handling calls (after-hours and busy times)
    // Average call handling time: 4 minutes = 0.067 hours
    const avgCallHandlingTime = 0.067; // hours per call
    const afterHoursCallRate = MCR > 0.3 ? 0.3 : MCR; // Estimate 30% of calls are after-hours/busy
    const callsHandledByAI = calcInputs.avgMonthlyPhoneCalls * afterHoursCallRate;
    const callHandlingHoursSaved = callsHandledByAI * avgCallHandlingTime;
    
    // 3. Automated follow-ups time saved (if they don't have automation)
    let followUpHoursSaved = 0;
    if (inputs.automatedFollowUpSystem === 'No' || inputs.automatedFollowUpSystem === 'We try to do it manually') {
      // Manual follow-up takes ~2 minutes per lead = 0.033 hours
      const leadsNeedingFollowUp = L * (1 - (calcInputs.avgFollowUpRate / 100));
      const manualFollowUpTime = 0.033; // hours per lead
      followUpHoursSaved = leadsNeedingFollowUp * manualFollowUpTime;
    }
    
    // 4. Reminders and scheduling automation (already included in admin hours, but add extra for automation)
    const reminderHoursSaved = Hours * 0.1; // Additional 10% for automated reminders
    
    const totalMonthlyHoursSaved = adminHoursSaved + callHandlingHoursSaved + followUpHoursSaved + reminderHoursSaved;
    
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
        paybackMonths: paybackMonths > 0 ? Number(paybackMonths.toFixed(1)) : 0,
        monthlyHoursSaved: Math.round(totalMonthlyHoursSaved)
      },
      assumptions: {
        aiCaptureRate: AiCapture,
        followUpUpliftPct: followUpUpliftPct,
        staffingReductionPct: staffingReductionPct
      }
    };
  };


  const handleInputChange = (field: keyof AuditInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      // Step 1: Lead Friction - requires responseTimeToInquiry and afterHoursCallHandling
      if (!inputs.responseTimeToInquiry || inputs.responseTimeToInquiry === '' || 
          !inputs.afterHoursCallHandling || inputs.afterHoursCallHandling === '') {
        alert('Please answer all questions before continuing.');
        return false;
      }
    } else if (step === 2) {
      // Step 2: Time Leakage - requires adminPingPongHours and automatedFollowUpSystem
      if (!inputs.adminPingPongHours || inputs.adminPingPongHours === '' || 
          !inputs.automatedFollowUpSystem || inputs.automatedFollowUpSystem === '') {
        alert('Please answer all questions before continuing.');
        return false;
      }
    } else if (step === 3) {
      // Step 3: Financial Data - requires avgCustomerLifetimeValue, avgMonthlyLeads, and avgLeadToBookingRate
      if (inputs.avgCustomerLifetimeValue === 0 || !inputs.avgCustomerLifetimeValue || 
          inputs.avgMonthlyLeads === 0 || !inputs.avgMonthlyLeads || 
          inputs.avgLeadToBookingRate === 0 || !inputs.avgLeadToBookingRate) {
        alert('Please answer all questions before continuing.');
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    // Validate current step before proceeding
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show loading animation
      setIsLoading(true);
      
      // Calculate results
      const auditResults = calculateAudit();
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store results in localStorage and navigate
      const resultsData = {
        inputs,
        results: auditResults
      };
      localStorage.setItem('aiRevenueAuditResults', JSON.stringify(resultsData));
      
      // Navigate to results page
      navigate('/ai-revenue-calculator/results');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };



  return (
    <div className="min-h-screen bg-white">
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
              <h1 className="text-[33px] md:text-[40px] lg:text-[53px] font-bold text-gray-900 mb-6 leading-tight">
                How Much Can You <span className="text-blue-600">Earn</span> with AI?
              </h1>
              
              <p className="text-[22px] text-gray-600 mb-8 max-w-2xl mx-auto">
                Get a personalized audit showing your potential revenue increase and cost savings with Boltcall's AI services.
              </p>
              
              <Button
                onClick={() => setSurveyStarted(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
              >
                Start Assessment
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
                    <div className="text-sm font-medium">Lead Friction</div>
                  </div>
                  <div className={`text-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className="text-sm font-semibold mb-1">2</div>
                    <div className="text-sm font-medium">Time Leakage</div>
                  </div>
                  <div className={`text-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className="text-sm font-semibold mb-1">3</div>
                    <div className="text-sm font-medium">Financial Data</div>
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

          {/* Loading Screen */}
          {isLoading && (
            <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="flex justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-16 h-16 text-blue-600" />
                    </motion.div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Calculating Your Revenue Potential...
                    </h2>
                  </div>
                  <div className="flex justify-center gap-2 pt-4">
                    <motion.div
                      className="w-2 h-2 bg-blue-600 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-blue-600 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-blue-600 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          {/* Form Section */}
          {!isLoading && (
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
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Lead Friction</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          How long does your team take to respond to a new inquiry?
                        </label>
                        <div className="max-w-md">
                          <DropdownComponent
                            options={responseTimeOptions}
                            value={inputs.responseTimeToInquiry}
                            onChange={(value) => handleInputChange('responseTimeToInquiry', value)}
                            placeholder="Select an option"
                          required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          What happens to calls after business hours or when staff is busy?
                        </label>
                        <div className="max-w-md">
                          <DropdownComponent
                            options={afterHoursOptions}
                            value={inputs.afterHoursCallHandling}
                            onChange={(value) => handleInputChange('afterHoursCallHandling', value)}
                            placeholder="Select an option"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </StepperContent>

                <StepperContent value={2}>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Time Leakage</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          How many hours per week does your staff spend on admin tasks (scheduling, rescheduling, reminders)?
                        </label>
                        <div className="max-w-md">
                          <DropdownComponent
                            options={adminPingPongOptions}
                            value={inputs.adminPingPongHours}
                            onChange={(value) => handleInputChange('adminPingPongHours', value)}
                            placeholder="Select an option"
                            required
                          />
                        </div>
                      </div>
                        <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          Do you have an automated system that follows up with leads who didn't book?
                        </label>
                        <div className="max-w-md">
                          <DropdownComponent
                            options={automatedFollowUpOptions}
                            value={inputs.automatedFollowUpSystem}
                            onChange={(value) => handleInputChange('automatedFollowUpSystem', value)}
                            placeholder="Select an option"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </StepperContent>

                <StepperContent value={3}>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Financial Data</h3>
                    <div className="space-y-5">
                        <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          What is your Average Customer Value (LTV)?
                        </label>
                        <div className="max-w-md">
                          <input
                            type="number"
                            value={inputs.avgCustomerLifetimeValue}
                            onChange={(e) => handleInputChange('avgCustomerLifetimeValue', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          How many new leads do you get per month?
                        </label>
                        <div className="max-w-md">
                          <input
                            type="number"
                            value={inputs.avgMonthlyLeads}
                            onChange={(e) => handleInputChange('avgMonthlyLeads', parseInt(e.target.value) || 0)}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            required
                          />
                        </div>
                        </div>
                        <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          What is your current Lead-to-Booking percentage?
                        </label>
                        <div className="max-w-md">
                          <input
                            type="number"
                            value={inputs.avgLeadToBookingRate}
                            onChange={(e) => handleInputChange('avgLeadToBookingRate', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            required
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Enter as a percentage (e.g., 10 for 10%)</p>
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
                  style={{ transition: 'none' }}
                >
                  {currentStep === 3 ? 'Calculate Results' : 'Next'}
                </Button>
              </div>
            </Stepper>
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

