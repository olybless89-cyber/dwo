import { ReactNode } from "react";
import teslaLoginImage from "@/assets/tesla-login.jpg";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full flex bg-background text-foreground">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 xl:p-24 justify-center relative">
        <div className="absolute top-8 left-8 md:top-12 md:left-16">
          <div className="font-sans font-bold tracking-[0.2em] text-xl text-white">TESLA PRO</div>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>

      {/* Right side: Image */}
      <div className="hidden lg:flex w-1/2 relative bg-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
        <img 
          src={teslaLoginImage} 
          alt="Tesla Model 3" 
          className="w-full h-full object-cover object-center opacity-80"
        />
        <div className="absolute bottom-16 left-16 z-20 max-w-lg">
          <h2 className="text-4xl font-light tracking-tight text-white mb-4">The Premium Ecosystem</h2>
          <p className="text-muted-foreground text-lg">
            Exclusive access to high-conviction investments, digital assets, and the Tesla Pro community.
          </p>
        </div>
      </div>
    </div>
  );
}
