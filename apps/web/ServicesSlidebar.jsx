import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionTemplate, useSpring } from "framer-motion";
import { ServiceBadge } from "./serviceLabel";

import {
    Box,
    Card,
    Typography,
    Button,
    Container,
} from "@mui/material";
import { button_bg_pallete, palette as appPalette, cardShadows, updated_palette, imageShadow } from "../../utils/Palette.js";

// Import images correctly for Vite
import customSoftwareImg from "../../assets/customized-software-development.png";
import webDesignImg from "../../assets/web-design-development.png";
import mobileAppImg from "../../assets/mobile-app-development.png";
import vrArImg from "../../assets/vr-ar-development.png";
import { servicesData as services } from "../../data/servicesData";

// --- INTERNALIZED UTILS (Replacing missing imports) ---
const palette = {
    text: {
        primary: updated_palette.light,
        secondary: updated_palette.grey,
        light: updated_palette.light,
        lightBg: updated_palette.bg
    }
};


/**
 * ServiceBadge Component
 * Integrated directly to resolve "Could not resolve" error.
 */


// Using imported services data.

const container = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.2 },
    },
};

const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { 
        opacity: 1, 
        scale: 1,
        transition: { type: "spring", damping: 20, stiffness: 100 }
    },
};

const ServiceItem = ({ service, index, total, scrollYProgress, cardShadow }) => {
    const navigate = useNavigate();
    // Each item has a focused range in the total scroll [0, 1]
    // 4 items: [0, 0.25, 0.5, 0.75, 1.0]
    const step = 1 / total;
    const start = index * step;
    const center = (index + 0.5) * step;
    const end = (index + 1) * step;

    // Arrival progress (from bottom to sticky focus)
    // We arrive before our start, and are in focus until the next card starts arriving
    const arrivalProgress = useTransform(scrollYProgress, [start - step, start], [0, 1]);
    const smoothArrival = useSpring(arrivalProgress, { stiffness: 40, damping: 20 });
    
    // Covering progress (when the NEXT card arrives)
    const coverProgress = useTransform(scrollYProgress, [start, end], [0, 1]);
    const smoothCover = useSpring(coverProgress, { stiffness: 40, damping: 20 });

    // Transforms based on arrival
    // Less aggressive blur, and it clears earlier (by 0.8 progress)
    const blurIn = useTransform(smoothArrival, [0, 0.5, 0.8], [8, 3, 0]);
    const blur = useMotionTemplate`blur(${blurIn}px)`;
    const opacityIn = useTransform(smoothArrival, [0, 0.4, 0.7], [0, 0.8, 1]);
    const scaleIn = useTransform(smoothArrival, [0, 0.4, 0.7], [0.85, 0.95, 1]);
    const yIn = useTransform(smoothArrival, [0, 0.4, 0.7], [500, 150, 0]);
    const rotateXIn = useTransform(smoothArrival, [0, 0.4, 0.7], [20, 10, 0]);

    // Transforms based on being covered by the NEXT card
    // We only start blurring and scaling down at the very end of the focus window (last 20%)
    const blurOutValue = useTransform(smoothCover, [0, 0.8, 1], [0, 0, 8]);
    const opacityOut = useTransform(smoothCover, [0, 0.8, 1], [1, 1, 0.7]);
    const scaleOut = useTransform(smoothCover, [0, 0.8, 1], [1, 1, 0.95]);

    // Combine them (In wins until in focus, then Out takes over)
    const blurValue = useMotionTemplate`blur(${blurIn}px)`; // Simpler: just use arrival blur for simplicity if desired
    
    // Final composite styles
    const opacity = useTransform([opacityIn, opacityOut], ([oIn, oOut]) => oIn * oOut);
    const scale = useTransform([scaleIn, scaleOut], ([sIn, sOut]) => sIn * sOut);
    const blurComposite = useTransform([blurIn, blurOutValue], ([bIn, bOut]) => `blur(${bIn + bOut}px)`);

    return (
        <Box 
            sx={{
                position: 'sticky',
                top: { xs: '20vh', sm: '130px', md: '155px',lg:'170px' },
                zIndex: index + 2,
                width: '100%',
            }}
        >
            <motion.div 
                variants={item}
                style={{
                    filter: blurComposite,
                    opacity: opacity,
                    scale: scale,
                    y: yIn,
                    rotateX: rotateXIn,
                    perspective: 1200,
                    transformOrigin: 'top center',
                    backgroundColor: updated_palette.dark,
                    borderRadius: "32px",
                }}
            >
                <Card
                    sx={{
                        borderRadius: "32px",
                        overflow: "hidden",
                        background: "inherit",
                        border: `1px solid ${updated_palette.border}`,
                        boxShadow: "none",
                        transition: "0.3s ease-out", 
                        position: "relative",
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        height: { xs: 'auto', sm: '360px', md: '520px' },
                    }}
                >
                    {/* LEFT CONTENT AREA */}
                    <Box sx={{
                        flex: 1.2,
                        p: { xs: 3, sm: 3.5, md: 5 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        textAlign: 'left'
                    }}>
                        {/* Top Group: Badge + Title + Description */}
                        <Box>
                            <ServiceBadge label="Service" />
                            <Typography variant="h4" sx={{ mt: { xs: 2, sm: 2.5 }, fontFamily: "'poppins', sans-serif", fontWeight: 800, color: palette.text.primary, fontSize: { xs: '1.6rem', sm: '1.7rem', md: '2rem' } }}>
                                {service.title}
                            </Typography>
                            <Typography sx={{ mt: { xs: 1.5, sm: 2 }, color: palette.text.primary, fontFamily: "'poppins', sans-serif", fontSize: { xs: "0.95rem", sm: "0.95rem", md: "1rem" }, lineHeight: 1.6, maxWidth: "600px", textAlign:"justify" }}>
                                {service.desc}
                            </Typography>
                        </Box>

                        {/* Bottom: Button pushed to bottom */}
                        <Button
                            onClick={() => navigate(`/services/${service.id}`)}
                            variant="contained"
                            sx={{
                                borderRadius: "50px",
                                background: updated_palette.red,
                                color: updated_palette.light,
                                px: 5,
                                py: 1.5,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                boxShadow: 'none',
                                position: 'relative',
                                overflow: 'hidden',
                                "&:hover": { bgcolor: updated_palette.light, color: updated_palette.bg, boxShadow: "none" },
                  "& .text": {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      width: "100%",
                      transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s",
                    },
                    "& .text.top": { transform: "translateY(0%)", opacity: 1 },
                    "& .text.bottom": {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      transform: "translateY(100%)",
                      opacity: 0,
                    },
                    "&:hover .text.top": { transform: "translateY(-100%)", opacity: 0 },
                    "&:hover .text.bottom": { transform: "translateY(0%)", opacity: 1 },
                            }}
                        >
                            <span className="text top">Our Core Services</span>
                  <span className="text bottom">Our Core Services</span>
                        </Button>
                    </Box>

                    {/* RIGHT IMAGE AREA */}
                    <Box sx={{
                        flex: 1,
                        position: 'relative',
                        height: { xs: '200px', sm: '280px', md: 'auto' },
                        m: { xs: 2, sm: 2, md: 3 },
                        borderRadius: "20px",
                        overflow: 'hidden',
                        alignSelf: { xs: 'stretch', sm: 'center', md: 'stretch' },
                        boxShadow: imageShadow === "no" ? "none" : imageShadow,
                    }}>
                        <Box
                            component="img"
                            src={service.image}
                            alt={service.title}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                        />
                    </Box>
                </Card>
            </motion.div>
        </Box>
    );
};


export default function ServicesSlidebar() {
    const listRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: listRef,
        offset: ["start center", "end center"]
    });

    return (
        <Box sx={{ background: updated_palette.bg, minHeight: "100vh", pb: 0, pt: { md: 10 }, position: 'relative' }}>

            {/* HERO SECTION - Enhanced with scroll-triggered fade-in */}
            <Box
                component={motion.div}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: "all" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                sx={{
                    py: { xs: 6, md: 10 },
                    textAlign: "center",
                    position: 'relative',
                    zIndex: 1, 
                    background: 'transparent',
                }}
            >
                <ServiceBadge label="Services" />
                <Typography
                    variant="h3"
                    sx={{
                        mt: 2,
                        color: palette.text.primary,
                        fontWeight: 700,
                        fontFamily: "'Poppins', sans-serif",

                        letterSpacing: '1px',
                        fontSize: { xs: "2rem", md: "2.8rem" }
                    }}
                >
                    Our Core Services
                </Typography>
            </Box>

            {/* SERVICES LIST (Horizontal Split Layout) */}
            <Container maxWidth={false} sx={{ position: 'relative', width: "100%", maxWidth: { xs: "90%", sm: "95%" }, px: 0 }}>
                <Box
                    ref={listRef}
                    component={motion.div}
                    variants={container}
                    initial="hidden"
                    animate="show"
                    sx={{ 
                        position: 'relative', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', // Horizontal centering
                        gap: 15, 
                        pb: '10vh', // No buffer at the bottom to ensure tight section transitions
                    }}
                >
                    {services.map((service, index) => (
                        <ServiceItem 
                            key={index} 
                            service={service} 
                            index={index} 
                            total={services.length}
                            scrollYProgress={scrollYProgress}
                            cardShadow={cardShadows[index % cardShadows.length]}
                        />
                    ))}
                </Box>
            </Container>
        </Box>
    );
}