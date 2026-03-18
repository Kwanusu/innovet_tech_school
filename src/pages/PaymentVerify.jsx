import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyPaystackPayment, resetPaymentState } from '../features/paymentSlice';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isVerifying, success, error } = useSelector((state) => state.payment);

  const reference = searchParams.get('reference');

  useEffect(() => {
    if (reference) {
      dispatch(verifyPaystackPayment({ reference }));
    } else {
      toast.error("Invalid payment reference.");
      navigate('/dashboard');
    }

    return () => dispatch(resetPaymentState());
  }, [dispatch, reference, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-100">
        {isVerifying && (
          <>
            <Loader2 className="h-16 w-16 text-amber-500 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Confirming Enrollment</h2>
            <p className="text-slate-500">
              We are finalizing your access to the course. This usually takes just a few seconds.
            </p>
          </>
        )}

        {success && (
          <>
            <div className="relative mb-6">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 -z-10"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">You're In!</h2>
            <p className="text-slate-500 mb-8">
              Payment verified. Your course materials have been unlocked in your dashboard.
            </p>
            <Button 
              onClick={() => navigate('/dashboard/my-courses')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-lg transition-all"
            >
              Start Learning Now
            </Button>
          </>
        )}

        {error && (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-500 mb-8">
              {typeof error === 'string' ? error : "Verification timed out. If your M-Pesa/Card was charged, don't worry—your account will be updated shortly."}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="w-full border-slate-200 text-slate-700 font-bold h-12"
              >
                Go to Dashboard
              </Button>
              <button 
                onClick={() => navigate('/contact-support')}
                className="text-sm text-slate-400 hover:text-slate-600 underline"
              >
                Contact support if you need help
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;