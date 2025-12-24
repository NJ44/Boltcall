// component.tsx
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Radix Primitives ---
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & { showArrow?: boolean }>(({ className, sideOffset = 4, showArrow = false, ...props }, ref) => ( <TooltipPrimitive.Portal><TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn("relative z-50 max-w-[280px] rounded-md bg-white dark:bg-[#1a1a1a] text-black dark:text-white px-1.5 py-1 text-xs border border-gray-200 dark:border-gray-800 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 transition-all duration-300 ease-in-out", className)} {...props}>{props.children}{showArrow && <TooltipPrimitive.Arrow className="-my-px fill-white dark:fill-[#1a1a1a]" />}</TooltipPrimitive.Content></TooltipPrimitive.Portal>));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Content>, React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>>(({ className, align = "center", sideOffset = 4, ...props }, ref) => ( <PopoverPrimitive.Portal><PopoverPrimitive.Content ref={ref} align={align} sideOffset={sideOffset} className={cn("z-50 w-64 rounded-xl bg-white dark:bg-[#1a1a1a] p-2 text-black dark:text-white shadow-md outline-none border border-gray-200 dark:border-gray-800 animate-in data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 transition-all duration-300 ease-in-out", className)} {...props} /></PopoverPrimitive.Portal>));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// --- SVG Icon Components ---
const Settings2Icon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}> <path d="M20 7h-9" /> <path d="M14 17H5" /> <circle cx="17" cy="17" r="3" /> <circle cx="7" cy="7" r="3" /> </svg> );
const SendIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}> <path d="M12 5.25L12 18.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M18.75 12L12 5.25L5.25 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> </svg> );
const XIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}> <line x1="18" y1="6" x2="6" y2="18" /> <line x1="6" y1="6" x2="18" y2="18" /> </svg> );
// Agent Icons
const MarketingIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}> <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path> <polyline points="9 22 9 12 15 12 15 22"></polyline> </svg> );
const SalesIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}> <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path> <circle cx="9" cy="7" r="4"></circle> <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path> <path d="M16 3.13a4 4 0 0 1 0 7.75"></path> </svg> );
const GoogleRankingIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}> <path d="M12 2L2 7l10 5 10-5-10-5z"></path> <path d="M2 17l10 5 10-5"></path> <path d="M2 12l10 5 10-5"></path> </svg> );
const GrowthIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}> <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline> <polyline points="17 6 23 6 23 12"></polyline> </svg> );


const agentsList = [ 
  { id: 'sales', name: 'Sales Agent', shortName: 'Sales', icon: SalesIcon, iconColor: 'text-blue-500' }, 
  { id: 'google-ranking', name: 'Google Ranking Agent', shortName: 'Google Ranking', icon: GoogleRankingIcon, iconColor: 'text-purple-500' }, 
  { id: 'marketing', name: 'Marketing Agent', shortName: 'Marketing', icon: MarketingIcon, iconColor: 'text-pink-500' }, 
  { id: 'growth', name: 'Business Growth Agent', shortName: 'Growth', icon: GrowthIcon, iconColor: 'text-green-500' }, 
];

// --- The Final, Self-Contained PromptBox Component ---
export interface PromptBoxProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onAgentChange?: (agentId: string | null) => void;
  selectedAgentId?: string | null;
}

export const PromptBox = React.forwardRef<HTMLTextAreaElement, PromptBoxProps>(
  ({ className, onAgentChange, selectedAgentId, ...props }, ref) => {
    const internalTextareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = React.useState("");
    const [selectedAgent, setSelectedAgent] = React.useState<string | null>(selectedAgentId || null);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    
    // Sync external agent selection
    React.useEffect(() => {
      if (selectedAgentId !== undefined) {
        setSelectedAgent(selectedAgentId);
      }
    }, [selectedAgentId]);
    React.useImperativeHandle(ref, () => internalTextareaRef.current!, []);
    React.useLayoutEffect(() => { const textarea = internalTextareaRef.current; if (textarea) { textarea.style.height = "auto"; const newHeight = Math.min(textarea.scrollHeight, 200); textarea.style.height = `${newHeight}px`; } }, [value]);
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { setValue(e.target.value); if (props.onChange) props.onChange(e); };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const form = internalTextareaRef.current?.closest('form');
        if (form) {
          form.requestSubmit();
        }
      }
      if (props.onKeyDown) props.onKeyDown(e);
    };
    
    // Listen for form reset events
    React.useEffect(() => {
      const textarea = internalTextareaRef.current;
      if (!textarea) return;
      
      const form = textarea.closest('form');
      if (!form) return;
      
      const handleReset = () => {
        setValue("");
      };
      
      form.addEventListener('reset', handleReset);
      return () => {
        form.removeEventListener('reset', handleReset);
      };
    }, []);
    const handleAgentSelect = (agentId: string | null) => {
      setSelectedAgent(agentId);
      if (onAgentChange) {
        onAgentChange(agentId);
      }
    };
    const hasValue = value.trim().length > 0;
    const activeAgent = selectedAgent ? agentsList.find(a => a.id === selectedAgent) : null;
    const ActiveAgentIcon = activeAgent?.icon;

    return (
      <div className={cn("flex flex-col rounded-[28px] p-2 shadow-lg transition-colors bg-white/10 backdrop-blur-md border border-white/20 cursor-text", className)}>
        <textarea ref={internalTextareaRef} rows={1} value={value} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Ask anything" className="custom-scrollbar w-full resize-none border-0 bg-transparent p-3 text-white placeholder:text-white/60 focus:ring-0 focus-visible:outline-none min-h-12" {...props} />
        
        <div className="mt-0.5 p-1 pt-0">
          <TooltipProvider delayDuration={100}>
            <div className="flex items-center gap-2">
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <Tooltip open={!isPopoverOpen && !selectedAgent ? undefined : false}>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <button type="button" className="flex h-8 items-center gap-2 rounded-full p-2 text-sm text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-ring">
                        <Settings2Icon className="h-4 w-4 text-white" />
                        {!selectedAgent && 'Agents'}
                      </button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" showArrow={true}>
                    <p>Choose the agent that best fits your question.</p>
                  </TooltipContent>
                </Tooltip>
                <PopoverContent side="top" align="start" className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col gap-1">
                    {agentsList.map((agent, index) => ( 
                      <motion.button 
                        key={agent.id} 
                        onClick={() => { handleAgentSelect(agent.id); setIsPopoverOpen(false); }} 
                        className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      > 
                        <agent.icon className={cn("h-4 w-4", agent.iconColor)} /> 
                        <span>{agent.name}</span> 
                      </motion.button> 
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {activeAgent && (
                <>
                  <div className="h-4 w-px bg-white/30" />
                  <button type="button" onClick={() => handleAgentSelect(null)} className="flex h-8 items-center gap-2 rounded-full px-2 text-sm hover:bg-white/20 cursor-pointer text-white transition-colors flex-row items-center justify-center border border-white/20 backdrop-blur-sm">
                    {ActiveAgentIcon && <ActiveAgentIcon className={cn("h-4 w-4", activeAgent.iconColor || "text-white")} />}
                    {activeAgent.shortName}
                    <XIcon className="h-4 w-4 text-white" />
                  </button>
                </>
              )}

              {/* MODIFIED: Right-aligned buttons container */}
              <div className="ml-auto flex items-center gap-2">
                <button type="submit" disabled={!hasValue} className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none bg-white text-black hover:bg-white/90 disabled:bg-white/40 disabled:text-white/60">
                  <SendIcon className="h-6 w-6 text-bold" />
                  <span className="sr-only">Send message</span>
                </button>
              </div>
            </div>
          </TooltipProvider>
        </div>
      </div>
    );
  }
);
PromptBox.displayName = "PromptBox";

