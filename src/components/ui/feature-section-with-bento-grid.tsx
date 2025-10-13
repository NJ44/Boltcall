
function Feature() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
            <div className="bg-muted rounded-lg lg:col-span-2 p-6 flex justify-center items-center shadow-lg h-56">
              <div className="flex flex-col text-center">
                <h3 className="text-2xl font-semibold tracking-tight mb-2">Instant Response</h3>
                <p className="text-muted-foreground text-base">
                  Respond to leads within seconds with AI-powered automation. Speed to lead is critical for conversion.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-6 flex justify-center items-center shadow-lg h-56">
              <div className="flex flex-col text-center">
                <h3 className="text-2xl font-semibold tracking-tight mb-2">AI Receptionist</h3>
                <p className="text-muted-foreground text-base">
                  24/7 voice AI that answers calls, qualifies leads, and books appointments automatically.
                </p>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-6 flex justify-center items-center shadow-lg h-56">
              <div className="flex flex-col text-center">
                <h3 className="text-2xl font-semibold tracking-tight mb-2">SMS Automation</h3>
                <p className="text-muted-foreground text-base">
                  Automated SMS follow-ups and WhatsApp booking ensure you stay connected with leads.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-lg lg:col-span-2 p-6 flex justify-center items-center shadow-lg h-56">
              <div className="flex flex-col text-center">
                <h3 className="text-2xl font-semibold tracking-tight mb-2">Real-time Analytics</h3>
                <p className="text-muted-foreground text-base">
                  Track response times, booked jobs, missed leads, and call transcripts all in one powerful dashboard.
                </p>
              </div>
            </div>
      </div>
    </div>
  );
}

export { Feature };

