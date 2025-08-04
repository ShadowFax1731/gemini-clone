import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { 
  sendOTP, 
  verifyOTP, 
  setPhoneNumber, 
  setSelectedCountry, 
  setCountries,
  clearError 
} from '../../store/slices/authSlice';
import { ChevronDown, Phone, MessageSquare, Sparkles } from 'lucide-react';

// Validation schemas
const phoneSchema = z.object({
  phoneNumber: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits')
});

const otpSchema = z.object({
  otp: z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits')
});

const Login = () => {
  const dispatch = useDispatch();
  const { 
    isLoading, 
    error, 
    otpSent, 
    selectedCountry, 
    countries 
  } = useSelector((state) => state.auth);
  
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Phone number form
  const phoneForm = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: ''
    }
  });

  // OTP form
  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ''
    }
  });

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format from API');
        }
        
        const formattedCountries = data
          .filter(country => country.idd?.root)
          .map(country => ({
            name: country.name.common,
            dialCode: country.idd.root + (country.idd.suffixes?.[0] || ''),
            flag: country.flag,
            code: country.cca2
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        dispatch(setCountries(formattedCountries));
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        // Fallback to default countries
        const defaultCountries = [
          { name: 'United States', dialCode: '+1', flag: '🇺🇸', code: 'US' },
          { name: 'India', dialCode: '+91', flag: '🇮🇳', code: 'IN' },
          { name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', code: 'GB' },
          { name: 'Canada', dialCode: '+1', flag: '🇨🇦', code: 'CA' },
          { name: 'Australia', dialCode: '+61', flag: '🇦🇺', code: 'AU' },
          { name: 'Germany', dialCode: '+49', flag: '🇩🇪', code: 'DE' },
          { name: 'France', dialCode: '+33', flag: '🇫🇷', code: 'FR' },
          { name: 'Japan', dialCode: '+81', flag: '🇯🇵', code: 'JP' },
          { name: 'Brazil', dialCode: '+55', flag: '🇧🇷', code: 'BR' },
          { name: 'Mexico', dialCode: '+52', flag: '🇲🇽', code: 'MX' }
        ];
        dispatch(setCountries(defaultCountries));
      }
    };

    fetchCountries();
  }, [dispatch]);

  // Handle phone number submission
  const onPhoneSubmit = async (data) => {
    const fullPhoneNumber = selectedCountry.dialCode + data.phoneNumber;
    dispatch(setPhoneNumber(fullPhoneNumber));
    
    try {
      await dispatch(sendOTP(fullPhoneNumber)).unwrap();
      toast.success('OTP sent successfully!');
    } catch (error) {
      toast.error(error || 'Failed to send OTP');
    }
  };

  // Handle OTP submission
  const onOtpSubmit = async (data) => {
    try {
      await dispatch(verifyOTP(data.otp)).unwrap();
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error || 'Invalid OTP');
    }
  };

  // Handle country selection
  const handleCountrySelect = (country) => {
    dispatch(setSelectedCountry(country));
    setShowCountryDropdown(false);
  };

  // Clear error when switching between forms
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [otpSent, dispatch, error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gemini Chat
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your AI conversation companion
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-6 shadow-xl">
          {!otpSent ? (
            // Phone Number Form
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="flex">
                  {/* Country Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <span className="mr-2">{selectedCountry.flag}</span>
                      <span className="text-sm">{selectedCountry.dialCode}</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 z-10 w-64 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                        {countries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <span className="mr-3">{country.flag}</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {country.name}
                            </span>
                            <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                              {country.dialCode}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Phone Input */}
                  <input
                    type="tel"
                    {...phoneForm.register('phoneNumber')}
                    className="flex-1 input-field rounded-l-none"
                    placeholder="Enter phone number"
                  />
                </div>
                {phoneForm.formState.errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {phoneForm.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Phone className="w-4 h-4 mr-2" />
                    Send OTP
                  </>
                )}
              </button>
            </form>
          ) : (
            // OTP Form
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
              <div className="text-center mb-4">
                <MessageSquare className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Enter OTP
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We've sent a 6-digit code to {selectedCountry.dialCode} {phoneForm.getValues('phoneNumber')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  OTP Code
                </label>
                <input
                  type="text"
                  {...otpForm.register('otp')}
                  className="input-field text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
                {otpForm.formState.errors.otp && (
                  <p className="text-red-500 text-sm mt-1">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  dispatch(clearError());
                  phoneForm.reset();
                  otpForm.reset();
                }}
                className="btn-secondary w-full"
              >
                Back to Phone Number
              </button>
            </form>
          )}
        </div>

        {/* Demo Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Demo: Enter any 6-digit number to continue
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 