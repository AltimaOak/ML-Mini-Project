import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Leaf, FileText, Settings } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#FAF8F5]">
      {/* 1. Hero Section (Seamless fading photo, matching reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left Column: Heading, Subtitle & Action Buttons */}
          <div className="lg:col-span-6 space-y-3.5">
            <div className="text-[11px] sm:text-xs font-bold tracking-widest text-utility-muted uppercase">
              TRACK &bull; PLAN &bull; SAVE
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[46px] font-extrabold text-utility-charcoal tracking-tight leading-[1.18] sm:leading-[1.14]">
              Know your electricity bill{' '}
              <span className="text-utility-orange block sm:inline">before it arrives.</span>
            </h1>

            <p className="text-xs sm:text-sm text-utility-secondary max-w-lg leading-relaxed pt-0.5">
              Estimate your monthly electricity bill using your consumption and household usage details. Make smarter energy choices.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/predict')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-utility-orange hover:bg-utility-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors w-full sm:w-auto"
              >
                <span>Predict My Bill</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-4.5 py-3 sm:py-2.5 bg-white hover:bg-cream-100 text-utility-charcoal text-sm font-semibold rounded-lg border border-utility-border shadow-soft transition-colors w-full sm:w-auto"
              >
                Learn How It Works
              </button>
            </div>
          </div>

          {/* Right Column: Seamlessly Faded Photo */}
          <div className="lg:col-span-6">
            <div className="relative w-full h-[200px] sm:h-[320px] lg:h-[390px] overflow-hidden rounded-xl sm:rounded-none">
              <img
                src="/hero-home-energy.jpg"
                alt="Cozy sunlit home interior with energy efficiency books, plant and light switch"
                className="w-full h-full object-cover"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 12%, black 28%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 12%, black 28%)',
                }}
                loading="eager"
              />
              {/* Left edge gradient fade into background */}
              <div className="absolute inset-y-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/60 to-transparent pointer-events-none" />
              {/* Bottom edge subtle fade */}
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#FAF8F5] to-transparent pointer-events-none" />
              {/* Top edge subtle fade */}
              <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#FAF8F5]/40 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Strip (White background with 3 round peach-badge items) */}
      <section className="bg-white border-y border-utility-border py-7 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1: Accurate Estimates */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#FDEDE2] text-utility-orange flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-utility-charcoal">Accurate Estimates</h2>
                <p className="text-xs text-utility-secondary mt-0.5 leading-snug">
                  Get an estimated monthly bill based on your electricity usage.
                </p>
              </div>
            </div>

            {/* Feature 2: Usage Insights */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#FDEDE2] text-utility-orange flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-utility-charcoal">Usage Insights</h2>
                <p className="text-xs text-utility-secondary mt-0.5 leading-snug">
                  Understand how your consumption affects your estimated bill.
                </p>
              </div>
            </div>

            {/* Feature 3: Printable Bill */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#FDEDE2] text-utility-orange flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-utility-charcoal">Printable Bill</h2>
                <p className="text-xs text-utility-secondary mt-0.5 leading-snug">
                  Generate and print a clean electricity bill after prediction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "HOW IT WORKS" Section (Warm cream background with 3 numbered steps matching reference) */}
      <section id="how-it-works" className="bg-[#FAF7F2] py-8 sm:py-12 lg:py-16 border-b border-utility-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Description Column */}
            <div className="lg:col-span-5 space-y-2 sm:space-y-2.5">
              <span className="text-xs font-bold tracking-widest text-utility-orange uppercase block">
                HOW IT WORKS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-utility-charcoal tracking-tight leading-[1.2]">
                Get your estimated bill <br className="hidden sm:inline" />
                in 3 simple steps
              </h2>
              <p className="text-xs sm:text-sm text-utility-secondary leading-relaxed max-w-sm">
                Enter a few details about your electricity usage and let our system estimate your monthly bill using machine learning.
              </p>
              <div className="pt-1.5 sm:pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/predict')}
                  className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-utility-orange hover:underline"
                >
                  <span>Try it now</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right: 3 Numbered Steps with clean connecting arrows */}
            <div className="lg:col-span-7">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 sm:gap-2">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="relative">
                    <span className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-utility-orange text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-[#FAF7F2] shadow-sm z-10">
                      1
                    </span>
                    <div className="w-16 h-16 rounded-full bg-white border border-utility-border shadow-sm flex items-center justify-center text-utility-charcoal">
                      <FileText className="w-6 h-6 text-utility-secondary stroke-[1.8]" />
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-utility-charcoal mt-3 sm:mt-3.5">
                    Enter Your Details
                  </h3>
                  <p className="text-xs text-utility-secondary/80 mt-1 max-w-[220px] sm:max-w-[160px] leading-relaxed">
                    Provide your consumption and household information.
                  </p>
                </div>

                {/* Arrow 1 */}
                <div className="hidden sm:flex items-center justify-center text-neutral-400 pt-5 px-1">
                  <ArrowRight className="w-5 h-5 stroke-[1.5]" />
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="relative">
                    <span className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-utility-orange text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-[#FAF7F2] shadow-sm z-10">
                      2
                    </span>
                    <div className="w-16 h-16 rounded-full bg-white border border-utility-border shadow-sm flex items-center justify-center text-utility-charcoal">
                      <Settings className="w-6 h-6 text-utility-secondary stroke-[1.8]" />
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-utility-charcoal mt-3 sm:mt-3.5">
                    Instant Calculation
                  </h3>
                  <p className="text-xs text-utility-secondary/80 mt-1 max-w-[220px] sm:max-w-[160px] leading-relaxed">
                    Our model predicts your monthly bill in seconds.
                  </p>
                </div>

                {/* Arrow 2 */}
                <div className="hidden sm:flex items-center justify-center text-neutral-400 pt-5 px-1">
                  <ArrowRight className="w-5 h-5 stroke-[1.5]" />
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="relative">
                    <span className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-utility-orange text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-[#FAF7F2] shadow-sm z-10">
                      3
                    </span>
                    <div className="w-16 h-16 rounded-full bg-white border border-utility-border shadow-sm flex items-center justify-center text-utility-charcoal">
                      <FileText className="w-6 h-6 text-utility-secondary stroke-[1.8]" />
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-utility-charcoal mt-3 sm:mt-3.5">
                    View &amp; Print Bill
                  </h3>
                  <p className="text-xs text-utility-secondary/80 mt-1 max-w-[220px] sm:max-w-[160px] leading-relaxed">
                    Review the details and download or print your bill.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
