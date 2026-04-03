
export const Component = () => {
  return (
   <div className="absolute inset-0 z-0">
  {/* Soft Blue Glow */}
   <div
     className="absolute inset-0"
     style={{
       backgroundImage: `
         radial-gradient(circle at center, #3B82F6 0%, transparent 70%)
       `,
       opacity: 0.6,
       mixBlendMode: "multiply",
       transform: 'translateY(100px)',
     }}
   />
</div>
  );
};
