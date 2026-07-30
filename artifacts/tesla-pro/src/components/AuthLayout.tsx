import { ReactNode, useState } from "react";
import teslaLoginImage from "@/assets/tesla-login.jpg";

export function AuthLayout({ children }: { children: ReactNode }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full flex bg-background text-foreground">
      {/* Left side: Form - renders immediately */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 xl:p-24 justify-center relative">
        <div className="absolute top-8 left-8 md:top-12 md:left-16">
          <div className="font-sans font-bold tracking-[0.2em] text-xl text-white">TESLA PRO</div>
        </div>

        <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </div>

      {/* Right side: Image - loads lazily */}
      <div 
        className="hidden lg:flex w-1/2 relative bg-card overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
        <img
          src={teslaLoginImage}
          alt="Tesla Model 3"
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center transition-opacity duration-700 ${imageLoaded ? 'opacity-80' : 'opacity-0'}`}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        <div className={`absolute bottom-16 left-16 z-20 max-w-lg transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-4xl font-light tracking-tight text-white mb-4">The Premium Ecosystem</h2>
          <p className="text-muted-foreground text-lg">
            Exclusive access to high-conviction investments, digital assets, and the Tesla Pro community.
          </p>
        </div>
      </div>
    </div>
  );
}
