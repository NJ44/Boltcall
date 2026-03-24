import React, { useState } from 'react';
import { Phone, Loader2 } from 'lucide-react';
import ModalShell from './ui/modal-shell';
import { PopButton } from './ui/pop-button';

interface TalkToAgentModalProps {
  open: boolean;
  onClose: () => void;
  agentId: string;
  agentName?: string;
}

const TalkToAgentModal: React.FC<TalkToAgentModalProps> = ({ open, onClose, agentId, agentName }) => {
  const [phone, setPhone] = useState('');
  const [calling, setCalling] = useState(false);
  const [callActive, setCallActive] = useState(false);

  const handleCall = () => {
    if (!phone.trim()) return;
    setCalling(true);

    // Load Retell widget script if needed, then init callback
    const doInit = () => {
      const container = document.getElementById('talk-agent-widget');
      if (container && (window as any).RetellChatWidget) {
        container.innerHTML = '<div id="talk-agent-mount"></div>';
        (window as any).RetellChatWidget.init({
          publicKey: import.meta.env.VITE_RETELL_PUBLIC_KEY || '',
          agentId,
          mode: 'callback',
          mount: document.getElementById('talk-agent-mount'),
          phoneNumber: phone,
        });
        setCallActive(true);
      }
      setCalling(false);
    };

    if (!document.querySelector('script[src="https://cdn.retellai.com/chat-widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.retellai.com/chat-widget.js';
      script.onload = doInit;
      script.onerror = () => setCalling(false);
      document.head.appendChild(script);
    } else {
      doInit();
    }
  };

  const handleClose = () => {
    setPhone('');
    setCalling(false);
    setCallActive(false);
    onClose();
  };

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title={`Talk to ${agentName || 'Your Agent'}`}
      maxWidth="max-w-md"
      footer={
        <PopButton onClick={handleClose}>
          {callActive ? 'End & Close' : 'Cancel'}
        </PopButton>
      }
    >
      <div className="space-y-4">
        {!callActive ? (
          <>
            <div className="text-center py-2">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600 text-sm">
                Enter your phone number and your AI agent will call you right now.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Your phone number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCall()}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-zinc-900"
                autoFocus
              />
            </div>

            <PopButton
              color="blue"
              onClick={handleCall}
              disabled={!phone.trim() || calling}
              className="w-full gap-2"
            >
              {calling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  Call Me Now
                </>
              )}
            </PopButton>

            <p className="text-xs text-gray-400 text-center">
              Your agent will call you within seconds. Standard rates may apply.
            </p>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Phone className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Calling you now...</h3>
            <p className="text-gray-500 text-sm mb-4">
              {agentName || 'Your AI agent'} is calling <span className="font-medium text-gray-700">{phone}</span>
            </p>
            <div id="talk-agent-widget" className="min-h-[60px]" />
          </div>
        )}
      </div>
    </ModalShell>
  );
};

export default TalkToAgentModal;
