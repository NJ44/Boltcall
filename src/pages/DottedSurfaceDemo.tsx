import { DottedSurface } from "@/components/ui/dotted-surface";
import { cn } from '@/lib/utils';

export default function DottedSurfaceDemo() {
	return (
		<div className="relative h-screen w-screen overflow-hidden bg-black">
			<DottedSurface />
			<div className="relative z-10 flex flex-col items-center justify-center h-full">
				<div
					aria-hidden="true"
					className={cn(
						'pointer-events-none absolute -top-10 left-1/2 w-full h-full -translate-x-1/2 rounded-full',
						'bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_50%)]',
						'blur-[30px]',
					)}
				/>
				<div className="text-center space-y-4">
					<h1 className="font-mono text-5xl md:text-6xl font-semibold text-white mb-4">
						Dotted Surface
					</h1>
					<p className="text-white/80 text-lg max-w-2xl mx-auto px-4">
						An animated 3D particle system creating a dynamic dotted surface effect.
						The dots move in wave patterns using Three.js.
					</p>
				</div>
			</div>
		</div>
	);
}

