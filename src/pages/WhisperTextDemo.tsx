import WhisperText from "../components/ui/whisper-text";

export default function WhisperPreview() {
  return (
      <div className="flex justify-center items-center min-h-screen w-full select-none">
      <WhisperText
        text="Your ideas, whisper style."
        className="font-semibold text-primary text-2xl sm:text-4xl"
        delay={100}
        duration={0.5}
        x={-20}
        y={0}
      />
    </div>
  );
}

