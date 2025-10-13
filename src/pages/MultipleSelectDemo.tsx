import { MultipleSelect } from "../components/ui/multiple-select";

export const TABS = [
  { key: 'lead-generation', name: 'Lead Generation' },
  { key: 'ai-receptionist', name: 'AI Receptionist' },
  { key: 'sms-automation', name: 'SMS Automation' },
  { key: 'call-tracking', name: 'Call Tracking' },
  { key: 'appointment-booking', name: 'Appointment Booking' },
  { key: 'analytics', name: 'Analytics' },
  { key: 'crm-integration', name: 'CRM Integration' },
  { key: 'voice-ai', name: 'Voice AI' },
  { key: 'transcription', name: 'Transcription' },
  { key: 'workflow-automation', name: 'Workflow Automation' },
  { key: 'multi-channel', name: 'Multi-Channel' },
  { key: 'qualification', name: 'Lead Qualification' },
  { key: 'whatsapp', name: 'WhatsApp' },
  { key: 'email-sync', name: 'Email Sync' },
  { key: 'calendar-sync', name: 'Calendar Sync' },
  { key: 'notifications', name: 'Notifications' },
  { key: 'dashboard', name: 'Dashboard' },
  { key: 'reporting', name: 'Reporting' },
  { key: 'custom-scripts', name: 'Custom Scripts' },
  { key: 'team-management', name: 'Team Management' },
];

export default function MultipleSelectDemo() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <MultipleSelect
        tags={TABS}
        onChange={(items) => {
          console.log("Selected Items:", items);
        }}
        defaultValue={[
          {
            key: 'ai-receptionist',
            name: 'AI Receptionist',
          },
        ]}
      />
    </div>
  );
}

