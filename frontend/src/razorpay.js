const SRC = 'https://checkout.razorpay.com/v1/checkout.js';
let loadPromise = null;

export const loadRazorpay = () => {
    if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
    if (window.Razorpay) return Promise.resolve(window.Razorpay);
    if (loadPromise) return loadPromise;

    loadPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${SRC}"]`);
        if (existing) {
            existing.addEventListener('load', () => resolve(window.Razorpay));
            existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay checkout')));
            return;
        }
        const s = document.createElement('script');
        s.src = SRC;
        s.async = true;
        s.onload = () => resolve(window.Razorpay);
        s.onerror = () => reject(new Error('Failed to load Razorpay checkout'));
        document.head.appendChild(s);
    });
    return loadPromise;
};

/**
 * Opens the Razorpay checkout modal. Resolves with the payment payload from Razorpay
 * (razorpay_order_id, razorpay_payment_id, razorpay_signature) when the user completes
 * payment. Rejects if the modal is dismissed without payment.
 */
export const openCheckout = async ({ keyId, razorpayOrderId, amountPaise, currency, name, description, prefill }) => {
    const Razorpay = await loadRazorpay();
    return new Promise((resolve, reject) => {
        const rzp = new Razorpay({
            key: keyId,
            order_id: razorpayOrderId,
            amount: amountPaise,
            currency: currency || 'INR',
            name: name || 'Printed Dimensions',
            description: description || 'Order payment',
            prefill: prefill || {},
            theme: { color: '#f59e0b' },
            handler: (resp) => resolve(resp),
            modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
        });
        rzp.on?.('payment.failed', (err) => reject(new Error(err?.error?.description || 'Payment failed')));
        rzp.open();
    });
};
