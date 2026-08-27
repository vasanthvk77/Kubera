import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';

export default function HeroTextAnimation({ reduce, textLines = ["We know the ground", "before we break it."] }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (reduce) {
      setIsVisible(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [reduce]);

  return (
    <Box ref={containerRef} sx={{ position: 'relative', py: 5 }}>
      {textLines.map((line, index) => (
        <Box key={index} sx={{ display: 'block', mb: 1, width: '100%' }}>
          <Typography
            variant="h2"
            className="font-display"
            sx={{
              fontFamily: 'inherit',
              fontSize: 'clamp(1.6rem, 6.5vw, 4.6rem)',
              fontWeight: 600,
              lineHeight: 1.08,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              color: 'transparent',
              backgroundImage: 'linear-gradient(100deg, #FFFFFF 0%, #E9E2CC 33%, #FFF8C4 46%, #D4AF37 50%, #FFFFFF 54%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0.05) 100%)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              // Pure CSS transition handled by MUI
              backgroundPosition: (isVisible || reduce) ? '0% 0%' : '100% 0%',
              transition: reduce ? 'none' : `background-position 2.2s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.35}s`,
              // Pure MUI inline keyframes for the glow
              animation: (isVisible && !reduce) ? `glowPulse${index} 2.2s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.35}s forwards` : 'none',
              [`@keyframes glowPulse${index}`]: {
                '0%': { filter: 'drop-shadow(0 0 0px transparent)' },
                '50%': { filter: 'drop-shadow(0 0 14px rgba(212,175,55,0.65))' },
                '100%': { filter: 'drop-shadow(0 0 0px transparent)' }
              }
            }}
          >
            {line}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
