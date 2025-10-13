import { Tilt } from "../components/ui/tilt";
import { Spotlight } from "../components/ui/spotlight";

function BasicTiltCard() {
  return (
    <Tilt rotationFactor={8} isRevese>
      <div
        style={{
          borderRadius: '12px',
        }}
        className='flex max-w-[270px] flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900'
      >
        <img
          src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80'
          alt='Futuristic cityscape'
          className='h-48 w-full object-cover'
        />
        <div className='p-2'>
          <h1 className='font-mono leading-snug text-zinc-950 dark:text-zinc-50'>
            Ghost in the Shell
          </h1>
          <p className='text-zinc-700 dark:text-zinc-400'>Kôkaku kidôtai</p>
        </div>
      </div>
    </Tilt>
  );
}

function TiltSpotlight() {
  return (
    <div className='aspect-video max-w-sm'>
      <Tilt
        rotationFactor={6}
        isRevese
        style={{
          transformOrigin: 'center center',
        }}
        springOptions={{
          stiffness: 26.7,
          damping: 4.1,
          mass: 0.2,
        }}
        className='group relative rounded-lg'
      >
        <Spotlight
          className='z-10 from-white/50 via-white/20 to-white/10 blur-2xl'
          size={248}
          springOptions={{
            stiffness: 26.7,
            damping: 4.1,
            mass: 0.2,
          }}
        />
        <img
          src='https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&q=80'
          alt='Space odyssey'
          className='h-32 w-full rounded-lg object-cover grayscale duration-700 group-hover:grayscale-0'
        />
      </Tilt>
      <div className='flex flex-col space-y-0.5 pb-0 pt-3'>
        <h3 className='font-mono text-sm font-medium text-zinc-500 dark:text-zinc-400'>
          2001: A Space Odyssey
        </h3>
        <p className='text-sm text-black dark:text-white'>Stanley Kubrick</p>
      </div>
    </div>
  );
}

const TiltDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-zinc-900 dark:text-zinc-50">
          Tilt Component Demos
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center justify-items-center">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-6 text-zinc-800 dark:text-zinc-200">
              Basic Tilt Card
            </h2>
            <BasicTiltCard />
          </div>
          
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-6 text-zinc-800 dark:text-zinc-200">
              Tilt with Spotlight
            </h2>
            <TiltSpotlight />
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            Hover over the cards to see the tilt effect in action
          </p>
        </div>
      </div>
    </div>
  );
};

export default TiltDemo;

