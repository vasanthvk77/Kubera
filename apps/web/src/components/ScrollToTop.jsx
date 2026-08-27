import { useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';

const HEADER_OFFSET = 112;

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useLayoutEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            return;
        }

        const rawHash = hash.slice(1);
        const dashIdx = rawHash.indexOf('--');
        const sectionId = dashIdx === -1 ? rawHash : rawHash.slice(0, dashIdx);
        const productSlug = dashIdx === -1 ? null : rawHash.slice(dashIdx + 2);

        const target = document.getElementById(sectionId);
        if (!target) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            return;
        }

        if (productSlug && sectionId === 'products') {
            window.dispatchEvent(new CustomEvent('kubera:select-product', { detail: { slug: productSlug } }));
        }

        const run = () => {
            const rect = target.getBoundingClientRect();
            const top = window.scrollY + rect.top - HEADER_OFFSET;
            window.scrollTo({ top, left: 0, behavior: 'smooth' });
        };

        run();
        const t = setTimeout(run, 80);
        return () => clearTimeout(t);
    }, [pathname, hash]);

    return null;
}

export default ScrollToTop;

export { ScrollToTop };
