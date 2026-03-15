import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { payments, bookings } from '../api';

const stripePromise = loadStripe('pk_test_51MockStripeKeyForServeNowAppXYZ');

const CheckoutForm = ({ clientSecret, bookingId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setLoading(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/customer/dashboard`,
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Mock updating booking to confirmed status, though our backend default creates 'pending' and payment is assumed in V1.
      // We will just redirect to dashboard
      navigate('/customer/dashboard');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm mt-3 bg-red-50 p-3 rounded-lg">{error}</div>}
      <button 
        disabled={!stripe || loading} 
        className="w-full apple-btn-primary py-4 text-lg disabled:opacity-50 mt-6"
      >
        {loading ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    bookings.getAll()
      .then(res => {
        const found = res.data.find(b => b.id === parseInt(id));
        if (found) {
          setBooking(found);
          return payments.createIntent(found.final_price);
        } else {
          navigate('/customer/dashboard');
        }
      })
      .then(res => {
        if(res) setClientSecret(res.data.clientSecret);
      })
      .catch(console.error);
  }, [id, navigate]);

  if (!clientSecret || !booking) {
    return <div className="flex h-screen items-center justify-center text-gray-500 font-medium">Securing payment session...</div>;
  }

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0071E3',
      colorBackground: '#ffffff',
      colorText: '#1d1d1f',
      fontFamily: 'Inter, -apple-system, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-4 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Complete your booking</h1>
        <p className="text-gray-500">Secure payment via Stripe for {booking.service_name}</p>
      </div>

      <div className="apple-card p-6 md:p-8">
        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <CheckoutForm clientSecret={clientSecret} bookingId={booking.id} amount={booking.final_price} />
        </Elements>
      </div>
    </div>
  );
}
