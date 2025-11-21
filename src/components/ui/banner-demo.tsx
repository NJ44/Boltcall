import React from 'react';
import { Banner } from "@/components/ui/banner";
import { cn } from '@/lib/utils';
import { ArrowRightIcon, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button-shadcn';

export default function BannerDemo() {
	const [show, setShow] = React.useState(true);

	return (
		<div className="relative flex h-full min-h-screen w-full items-center justify-center">
			{/* Radial spotlight */}
			<div
				aria-hidden="true"
				className={cn(
					'pointer-events-none absolute -top-1/3 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full',
					'bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]',
					'blur-[30px]',
				)}
			/>
			<Banner
				show={show}
				onHide={() => setShow(false)}
				variant="default"
				title="AI Dashboard is here!"
				description="Experience the future of analytics"
				showShade={true}
				closable={true}
				icon={<Rocket />}
				action={
					<Button
						onClick={() => setShow(false)}
						className="inline-flex items-center gap-1 rounded-md bg-black/10 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
						variant="ghost"
					>
						Try now
						<ArrowRightIcon className="h-3 w-3" />
					</Button>
				}
			/>
		</div>
	);
}

