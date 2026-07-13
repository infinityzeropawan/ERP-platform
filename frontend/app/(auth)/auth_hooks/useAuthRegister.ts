import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_URLS } from '../auth_url_config';
import { RegisterFormDetails } from '../auth_types';

export function useAuthRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<RegisterFormDetails>({
    name: '', email: '', phone: '', dob: '', gender: '',
    fatherName: '', motherName: '', address: '', bloodGroup: '',
    class: '', password: '', confirmPassword: '', institutionSlug: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (key: keyof RegisterFormDetails, value: string) => {
    setForm(p => ({ ...p, [key]: value }));
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.phone.length < 10) e.phone = 'Valid phone required';
    if (!form.dob) e.dob = 'Date of birth required';
    if (!form.gender) e.gender = 'Gender required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.institutionSlug.trim()) e.institutionSlug = 'Institution Code is required';
    if (!form.fatherName.trim()) e.fatherName = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.class) e.class = 'Required';
    if ((form.password?.length || 0) < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) setStep(2);
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);

    try {
      const res = await fetch(AUTH_URLS.API_REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit registration');

      alert('Registration submitted successfully!');
      router.push(AUTH_URLS.PENDING);
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    form,
    errors,
    loading,
    updateField,
    handleNextStep,
    handlePreviousStep,
    handleSubmit
  };
}
