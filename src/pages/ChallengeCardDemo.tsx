import { ChallengeCard } from "@/components/ui/card-9"; // Adjust the import path



export default function ChallengeCardDemo() {

  return (

    <div className="flex min-h-[400px] w-full items-center justify-center bg-background p-4">

      <ChallengeCard

        title="End March 160 KM Challenge"

        description="Complete 160 KM until end of March and you will get a surprise gift."

        buttonText="Join Challenge"

        // Example of custom background color

        // backgroundColor="bg-blue-500"

      />

    </div>

  );

}

