import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';

// Initial points data - edit this array to add/remove points
const INITIAL_POINTS = [
  "01/10",
  "01/15",
  "01/20",
  "02/01",
  "02/14"
];

const TOTAL_SLOTS = 12;

export default function App() {
  const [stage, setStage] = useState<'intro' | 'flipping' | 'expanding' | 'main'>('intro');

  useEffect(() => {
    // Timeline:
    // 0s: Intro starts (Card visible)
    // 1.5s: Flip starts (1s duration)
    // 2.5s: Expand starts (1s duration)
    // 3.5s: Switch to main content
    
    const flipTimer = setTimeout(() => {
      setStage('flipping');
    }, 1500);

    const expandTimer = setTimeout(() => {
      setStage('expanding');
    }, 2500);

    const mainTimer = setTimeout(() => {
      setStage('main');
    }, 3500);

    return () => {
      clearTimeout(flipTimer);
      clearTimeout(expandTimer);
      clearTimeout(mainTimer);
    };
  }, []);

  return (
    <div className="bg-white h-screen w-full overflow-hidden font-sans text-black">
      {/* Container - Full width/height */}
      <div className="w-full h-full relative bg-white flex flex-col">
        
        {/* Intro Animation Layer */}
        {stage !== 'main' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-100">
            <motion.div
              initial={{ rotateY: 0, scale: 1 }}
              animate={{
                rotateY: stage === 'flipping' || stage === 'expanding' ? 180 : 0,
                scale: stage === 'expanding' ? 50 : 1
              }}
              transition={{ 
                rotateY: { duration: 1, ease: "easeInOut" },
                scale: { duration: 1, ease: "easeInOut", delay: stage === 'expanding' ? 0 : 0 } // Scale happens after flip state change triggers
              }}
              className="relative w-64 h-96 bg-white shadow-xl rounded-lg backface-hidden"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of Card */}
              <div className="absolute inset-0 backface-hidden p-4 overflow-hidden">
                {/* Huge Faint Pencil Icon in Center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                  <Pencil size={200} strokeWidth={1} />
                </div>

                {/* Top Right: Vertical Japanese Text (Smaller) */}
                <div className="absolute top-4 right-4 h-3/4 flex flex-col items-center">
                   <h1 className="text-3xl font-serif font-bold tracking-widest text-black leading-none" style={{ writingMode: 'vertical-rl' }}>
                    鉛筆コーヒー
                  </h1>
                </div>

                {/* Bottom Left: Cursive Text (Larger) */}
                <div className="absolute bottom-4 left-4">
                  <span className="font-cursive text-4xl text-gray-600 transform -rotate-12 inline-block">
                    Enpitu Coffee
                  </span>
                </div>
              </div>

              {/* Back of Card (White) */}
              <div 
                className="absolute inset-0 bg-white backface-hidden" 
                style={{ transform: 'rotateY(180deg)' }} 
              />
            </motion.div>
          </div>
        )}

        {/* Main Content Layer */}
        {stage === 'main' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col h-full w-full bg-white"
          >
            {/* Header - No fill, black text, full width text */}
            <div className="w-full pt-2 pb-0 px-1 shrink-0 leading-none">
              <h2 className="w-full text-center font-bold font-sans text-black leading-none whitespace-nowrap" style={{ fontSize: '5.5vw' }}>
                ■ポイントをすべて貯めると一杯無料
              </h2>
            </div>

            {/* Grid Container with Margin - Reduced top padding */}
            <div className="flex-1 px-4 pb-4 pt-1 w-full h-full">
              {/* Grid - Thick Outer Border */}
              <div className="w-full h-full border-4 border-black grid grid-cols-3 grid-rows-4 bg-white">
                {Array.from({ length: TOTAL_SLOTS }).map((_, index) => {
                  const rawDate = INITIAL_POINTS[index];
                  let formattedDate = "";
                  if (rawDate) {
                    const [month, day] = rawDate.split('/');
                    formattedDate = `${parseInt(month)}/${parseInt(day)}`;
                  }

                  // Borders: Thin inner borders
                  // Right border for cols 1, 2
                  // Bottom border for rows 1, 2, 3
                  const isLastCol = (index + 1) % 3 === 0;
                  const isLastRow = index >= 9;

                  return (
                    <div 
                      key={index} 
                      className={`
                        relative flex items-center justify-center overflow-hidden
                        border-black
                        ${!isLastCol ? 'border-r' : ''}
                        ${!isLastRow ? 'border-b' : ''}
                      `}
                    >
                      {/* Stamp - Perfect Circle, Max Size */}
                      {formattedDate && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            delay: index * 0.15 + 0.5, 
                            duration: 0.3 
                          }}
                          className="w-[90%] aspect-square rounded-full border-[3px] border-vermilion text-vermilion flex items-center justify-center transform -rotate-12 bg-transparent absolute"
                        >
                           <span className="font-bold tracking-tighter leading-none whitespace-nowrap" style={{ fontSize: 'min(11vw, 5.5vh)' }}>
                             {formattedDate}
                           </span>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}


