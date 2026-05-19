import React, { useEffect, useRef, useState } from 'react';

const GSI_SRC = 'https://accounts.google.com/gsi/client';

let gsiPromise = null;
const loadGsi = () => {
    if (gsiPromise) return gsiPromise;
    gsiPromise = new Promise((resolve, reject) => {
        if (typeof window === 'undefined') return reject(new Error('No window'));
        if (window.google && window.google.accounts && window.google.accounts.id) {
            return resolve(window.google);
        }
        const existing = document.querySelector(`script[src="${GSI_SRC}"]`);
        if (existing) {
            existing.addEventListener('load', () => resolve(window.google));
            existing.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services')));
            return;
        }
        const script = document.createElement('script');
        script.src = GSI_SRC;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(window.google);
        script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
        document.head.appendChild(script);
    });
    return gsiPromise;
};

const GoogleSignInButton = ({ onCredential, onError }) => {
    const containerRef = useRef(null);
    const [unavailable, setUnavailable] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const init = async () => {
            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
            if (!clientId) {
                if (!cancelled) setUnavailable(true);
                return;
            }
            try {
                const google = await loadGsi();
                if (cancelled || !containerRef.current) return;
                google.accounts.id.initialize({
                    client_id: clientId,
                    callback: ({ credential }) => {
                        if (credential) onCredential?.(credential);
                    },
                    ux_mode: 'popup',
                });
                google.accounts.id.renderButton(containerRef.current, {
                    type: 'standard',
                    theme: 'filled_black',
                    size: 'large',
                    text: 'continue_with',
                    shape: 'rectangular',
                    logo_alignment: 'left',
                    width: containerRef.current.offsetWidth || 300,
                });
            } catch (err) {
                if (cancelled) return;
                onError?.(err.message || 'Could not load Google sign-in');
                setUnavailable(true);
            }
        };
        init();
        return () => { cancelled = true; };
    }, [onCredential, onError]);

    if (unavailable) {
        return (
            <div className="text-xs text-gray-500 text-center py-2">
                Google sign-in is not configured. Set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>frontend/.env</code>.
            </div>
        );
    }

    return <div ref={containerRef} className="flex justify-center w-full" />;
};

export default GoogleSignInButton;
