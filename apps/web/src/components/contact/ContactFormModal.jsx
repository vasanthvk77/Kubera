import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X, Check, User, Building2, Briefcase, Mail, Phone, MessageSquare, Package, MapPin } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const PRODUCT_OPTIONS = [
  { slug: 'gold-bars', name: 'Gold Bars' },
  { slug: 'gold-ore', name: 'Gold Ore' },
  { slug: 'gold-dust', name: 'Gold Dust' },
  { slug: 'steam-coal', name: 'Steam Coal' },
  { slug: 'coking-coal', name: 'Coking Coal' },
  { slug: 'industrial-coal', name: 'Industrial Coal' },
  { slug: 'pipeline-metals', name: 'Copper, Iron Ore, Lithium, Nickel' },
];

const COUNTRIES = [
  { value: 'Afghanistan', label: 'Afghanistan' },
  { value: 'Albania', label: 'Albania' },
  { value: 'Algeria', label: 'Algeria' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Armenia', label: 'Armenia' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Austria', label: 'Austria' },
  { value: 'Azerbaijan', label: 'Azerbaijan' },
  { value: 'Bahrain', label: 'Bahrain' },
  { value: 'Bangladesh', label: 'Bangladesh' },
  { value: 'Belarus', label: 'Belarus' },
  { value: 'Belgium', label: 'Belgium' },
  { value: 'Bhutan', label: 'Bhutan' },
  { value: 'Bolivia', label: 'Bolivia' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Brunei', label: 'Brunei' },
  { value: 'Bulgaria', label: 'Bulgaria' },
  { value: 'Cambodia', label: 'Cambodia' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Chile', label: 'Chile' },
  { value: 'China', label: 'China' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Costa Rica', label: 'Costa Rica' },
  { value: 'Croatia', label: 'Croatia' },
  { value: 'Cuba', label: 'Cuba' },
  { value: 'Cyprus', label: 'Cyprus' },
  { value: 'Czech Republic', label: 'Czech Republic' },
  { value: 'Denmark', label: 'Denmark' },
  { value: 'Dominican Republic', label: 'Dominican Republic' },
  { value: 'Ecuador', label: 'Ecuador' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'El Salvador', label: 'El Salvador' },
  { value: 'Estonia', label: 'Estonia' },
  { value: 'Ethiopia', label: 'Ethiopia' },
  { value: 'Finland', label: 'Finland' },
  { value: 'France', label: 'France' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'Greece', label: 'Greece' },
  { value: 'Guatemala', label: 'Guatemala' },
  { value: 'Honduras', label: 'Honduras' },
  { value: 'Hong Kong', label: 'Hong Kong' },
  { value: 'Hungary', label: 'Hungary' },
  { value: 'Iceland', label: 'Iceland' },
  { value: 'India', label: 'India' },
  { value: 'Indonesia', label: 'Indonesia' },
  { value: 'Iran', label: 'Iran' },
  { value: 'Iraq', label: 'Iraq' },
  { value: 'Ireland', label: 'Ireland' },
  { value: 'Israel', label: 'Israel' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Jamaica', label: 'Jamaica' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Jordan', label: 'Jordan' },
  { value: 'Kazakhstan', label: 'Kazakhstan' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Kuwait', label: 'Kuwait' },
  { value: 'Kyrgyzstan', label: 'Kyrgyzstan' },
  { value: 'Laos', label: 'Laos' },
  { value: 'Latvia', label: 'Latvia' },
  { value: 'Lebanon', label: 'Lebanon' },
  { value: 'Lithuania', label: 'Lithuania' },
  { value: 'Luxembourg', label: 'Luxembourg' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'Maldives', label: 'Maldives' },
  { value: 'Malta', label: 'Malta' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'Moldova', label: 'Moldova' },
  { value: 'Monaco', label: 'Monaco' },
  { value: 'Mongolia', label: 'Mongolia' },
  { value: 'Morocco', label: 'Morocco' },
  { value: 'Mozambique', label: 'Mozambique' },
  { value: 'Myanmar', label: 'Myanmar' },
  { value: 'Nepal', label: 'Nepal' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'New Zealand', label: 'New Zealand' },
  { value: 'Nicaragua', label: 'Nicaragua' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Norway', label: 'Norway' },
  { value: 'Oman', label: 'Oman' },
  { value: 'Pakistan', label: 'Pakistan' },
  { value: 'Palestine', label: 'Palestine' },
  { value: 'Panama', label: 'Panama' },
  { value: 'Paraguay', label: 'Paraguay' },
  { value: 'Peru', label: 'Peru' },
  { value: 'Philippines', label: 'Philippines' },
  { value: 'Poland', label: 'Poland' },
  { value: 'Portugal', label: 'Portugal' },
  { value: 'Qatar', label: 'Qatar' },
  { value: 'Romania', label: 'Romania' },
  { value: 'Russia', label: 'Russia' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'Serbia', label: 'Serbia' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'Slovakia', label: 'Slovakia' },
  { value: 'Slovenia', label: 'Slovenia' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Sri Lanka', label: 'Sri Lanka' },
  { value: 'Sweden', label: 'Sweden' },
  { value: 'Switzerland', label: 'Switzerland' },
  { value: 'Syria', label: 'Syria' },
  { value: 'Taiwan', label: 'Taiwan' },
  { value: 'Tajikistan', label: 'Tajikistan' },
  { value: 'Tanzania', label: 'Tanzania' },
  { value: 'Thailand', label: 'Thailand' },
  { value: 'Tunisia', label: 'Tunisia' },
  { value: 'Turkey', label: 'Turkey' },
  { value: 'Turkmenistan', label: 'Turkmenistan' },
  { value: 'Uganda', label: 'Uganda' },
  { value: 'Ukraine', label: 'Ukraine' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'United States', label: 'United States' },
  { value: 'Uruguay', label: 'Uruguay' },
  { value: 'Uzbekistan', label: 'Uzbekistan' },
  { value: 'Venezuela', label: 'Venezuela' },
  { value: 'Vietnam', label: 'Vietnam' },
  { value: 'Yemen', label: 'Yemen' },
  { value: 'Zambia', label: 'Zambia' },
  { value: 'Zimbabwe', label: 'Zimbabwe' },
];

const formSchema = z.object({
  name: z.string().min(2, 'Full Name is required.'),
  company: z.string().optional().or(z.literal('')),
  position: z.string().optional().or(z.literal('')),
  email: z
    .string()
    .min(1, 'Email Address is required.')
    .email('Please enter a valid Email Address.'),
  phone: z
    .string()
    .min(7, 'Phone Number must be at least 7 digits.')
    .regex(/^[+]?[\d\s\-\.\(\)\/]+$/, 'Please enter a valid Phone Number.'),
  country: z.string().min(2, 'Country / Region is required.'),
  enquiryType: z.array(z.string()).optional().default([]),
  message: z.string().optional().or(z.literal('')),
});

const FieldWrapper = ({ children, className = '' }) => (
  <div className={cn('space-y-2', className)}>{children}</div>
);

const FieldError = ({ children }) => (
  <p className="text-[11px] font-medium tracking-wide text-red-400">{children}</p>
);

const InputIcon = ({ Icon, hasError }) => (
  <div
    className={cn(
      'pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 transition-colors',
      hasError ? 'text-red-400' : 'text-[#D4AF37]/70'
    )}
  >
    <Icon className="h-4 w-4" strokeWidth={1.5} />
  </div>
);

function safeToast(type, msg, extra) {
  try {
    if (type === 'success' && toast && typeof toast.success === 'function') {
      toast.success(msg, extra || {});
    } else if (type === 'error' && toast && typeof toast.error === 'function') {
      toast.error(msg, extra || {});
    } else if (toast && typeof toast === 'function') {
      toast(msg, extra || {});
    } else {
      throw new Error('no toast');
    }
  } catch (_) {
    try {
      if (typeof window !== 'undefined' && typeof window.alert === 'function') {
        window.alert((type === 'success' ? '✅ ' : '❌ ') + msg);
      }
    } catch (__) {}
  }
}

export default function ContactFormModal({
  open,
  onOpenChange,
  title = 'Contact Us',
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      company: '',
      position: '',
      email: '',
      phone: '',
      country: '',
      enquiryType: [],
      message: '',
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (open && isSubmitSuccessful) {
      reset();
    }
  }, [open, isSubmitSuccessful, reset]);

  const selectedEnquiry = watch('enquiryType') || [];
  const selectedCountry = watch('country') || '';

  function toggleProduct(slug, checked) {
    try {
      const current = [...selectedEnquiry];
      const idx = current.indexOf(slug);
      if (checked && idx === -1) {
        current.push(slug);
      } else if (!checked && idx !== -1) {
        current.splice(idx, 1);
      }
      setValue('enquiryType', current, { shouldDirty: true });
    } catch (_) {}
  }

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      const payload = {
        name: String(values.name || '').trim(),
        company: String(values.company || '').trim(),
        position: String(values.position || '').trim(),
        email: String(values.email || '').trim(),
        phone: String(values.phone || '').trim(),
        country: String(values.country || ''),
        enquiryType: Array.isArray(values.enquiryType)
          ? values.enquiryType
              .map((slug) => {
                try {
                  const opt = PRODUCT_OPTIONS.find((p) => p.slug === slug);
                  return opt ? opt.name : String(slug);
                } catch (_) { return String(slug); }
              })
              .filter(Boolean)
          : [],
        message: String(values.message || '').trim(),
      };

      let response;
      try {
        response = await fetch('http://localhost:8000/contact_mailer.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (fetchErr) {
        try {
          response = await fetch('/contact_mailer.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (fetchErr2) {
          safeToast('error', 'Network error. PHP server may not be running on port 8000.', {
            duration: 10000,
            position: 'top-center',
            classNames: {
              toast: '!bg-[#151515] !border-2 !border-red-500/80 !rounded-lg !shadow-[0_0_25px_rgba(239,68,68,0.2)] !min-w-[320px] !sm:min-w-[420px] !px-5 !py-4',
              title: '!text-red-400 !text-base !font-bold !tracking-wide',
              description: '!text-white/80 !text-sm !font-medium !mt-1.5',
              errorIcon: '!text-red-400',
              closeButton: '!text-white/70 hover:!text-white',
            },
          });
          setIsSubmitting(false);
          return;
        }
      }

      let result = { status: response.ok ? 'success' : 'error' };
      try {
        const txt = await response.text();
        try {
          if (txt && txt.charAt(0) === '{') {
            result = JSON.parse(txt);
          }
        } catch (_parseErr) {}
      } catch (_readErr) {}

      if (response.ok && result && result.status === 'success') {
        safeToast('success', result.message || 'Message received. We will get back to you soon!', {
          description: `${title} — ${payload.name}`,
          duration: 10000,
          position: 'top-center',
          classNames: {
            toast: '!bg-[#151515] !border-2 !border-[#D4AF37] !rounded-lg !shadow-[0_0_30px_rgba(212,175,55,0.25)] !min-w-[320px] !sm:min-w-[420px] !px-5 !py-4',
            title: '!text-[#D4AF37] !text-base !font-bold !tracking-wide',
            description: '!text-white/85 !text-sm !font-medium !mt-1.5',
            successIcon: '!text-[#D4AF37]',
            closeButton: '!text-white/70 hover:!text-white',
          },
        });
        try {
          setIsSubmitting(false);
          if (typeof onOpenChange === 'function') onOpenChange(false);
          reset();
          return;
        } catch (_) { /* noop */ }
      } else {
        safeToast('error', result && result.message ? result.message : 'Failed to send your message. Please try again.', {
          duration: 9000,
          position: 'top-center',
          classNames: {
            toast: '!bg-[#151515] !border-2 !border-red-500/80 !rounded-lg !shadow-[0_0_25px_rgba(239,68,68,0.2)] !min-w-[320px] !sm:min-w-[400px] !px-5 !py-4',
            title: '!text-red-400 !text-base !font-bold !tracking-wide',
            description: '!text-white/80 !text-sm !font-medium !mt-1.5',
            errorIcon: '!text-red-400',
            closeButton: '!text-white/70 hover:!text-white',
          },
        });
      }
    } catch (outerErr) {
      safeToast('error', 'Unexpected error. Please try again or email us directly.', {
        duration: 10000,
        position: 'top-center',
        classNames: {
          toast: '!bg-[#151515] !border-2 !border-red-500/80 !rounded-lg !shadow-[0_0_25px_rgba(239,68,68,0.2)] !min-w-[320px] !sm:min-w-[400px] !px-5 !py-4',
          title: '!text-red-400 !text-base !font-bold !tracking-wide',
          description: '!text-white/80 !text-sm !font-medium !mt-1.5',
          errorIcon: '!text-red-400',
          closeButton: '!text-white/70 hover:!text-white',
        },
      });
    } finally {
      setTimeout(() => {
        try { setIsSubmitting(false); } catch (_) {}
      }, 200);
    }
  }

  let handleSafeSubmit;
  try {
    handleSafeSubmit = handleSubmit(onSubmit);
  } catch (_) {
    handleSafeSubmit = onSubmit;
  }

  return (
    <Dialog open={!!open} onOpenChange={(v) => { try { onOpenChange?.(v); } catch (_) {} }}>
      <DialogContent
        hideClose={true}
        className={cn(
          'max-w-[92vw] w-[560px] sm:w-[620px] max-h-[92vh] flex flex-col overflow-hidden',
          'border border-white/10 bg-[#0F0F0F] text-white',
          'rounded-sm shadow-2xl shadow-black/80',
          'p-0'
        )}
      >
        <div className="sticky top-0 z-30 flex-shrink-0 border-b border-white/[0.08] bg-gradient-to-b from-[#151515] to-[#0F0F0F] px-7 pt-7 pb-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-10 bg-[#D4AF37]/50" />
                <span className="font-mono2 text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]">
                  Kubera Resources
                </span>
              </div>
              <DialogHeader className="p-0 text-left">
                <DialogTitle className="font-display text-2xl font-semibold tracking-[-0.01em] text-white">
                  {title}
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm leading-relaxed text-white/45">
                  Fill in the form below and our team will respond within 24 hours.
                </DialogDescription>
              </DialogHeader>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => { try { onOpenChange?.(false); } catch (_) {} }}
              className="flex-shrink-0 rounded-sm border border-white/15 p-2.5 text-white/70 transition-all duration-200 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
        <form onSubmit={(e) => { try { e.preventDefault(); handleSafeSubmit(e); } catch (_) {} }} className="space-y-5 px-7 py-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FieldWrapper className="sm:col-span-2">
              <Label htmlFor="cf-name" className="font-mono2 text-[10px] uppercase tracking-[0.22em] text-white/55">
                Full Name <span className="text-[#D4AF37]">*</span>
              </Label>
              <div className="relative">
                <InputIcon Icon={User} hasError={!!errors.name} />
                <Input
                  id="cf-name"
                  type="text"
                  placeholder="John Smith"
                  autoComplete="name"
                  className={cn(
                    'h-11 border-white/12 bg-white/[0.03] pl-11 text-sm placeholder:text-white/30',
                    'focus-visible:ring-[#D4AF37]/60 focus-visible:border-[#D4AF37]/60',
                    errors.name && 'border-red-400/60 focus-visible:ring-red-400/60'
                  )}
                  {...register('name')}
                />
              </div>
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </FieldWrapper>

            {/* <FieldWrapper>
              <Label htmlFor="cf-company" className="font-mono2 text-[10px] uppercase tracking-[0.22em] text-white/55">
                Company / Organization
              </Label>
              <div className="relative">
                <InputIcon Icon={Building2} hasError={!!errors.company} />
                <Input
                  id="cf-company"
                  type="text"
                  placeholder="Acme Mining Ltd."
                  autoComplete="organization"
                  className={cn(
                    'h-11 border-white/12 bg-white/[0.03] pl-11 text-sm placeholder:text-white/30',
                    'focus-visible:ring-[#D4AF37]/60 focus-visible:border-[#D4AF37]/60'
                  )}
                  {...register('company')}
                />
              </div>
            </FieldWrapper> */}

{/* 
            <FieldWrapper>
              <Label htmlFor="cf-position" className="font-mono2 text-[10px] uppercase tracking-[0.22em] text-white/55">
                Position
              </Label>
              <div className="relative">
                <InputIcon Icon={Briefcase} hasError={!!errors.position} />
                <Input
                  id="cf-position"
                  type="text"
                  placeholder="Procurement Manager"
                  autoComplete="organization-title"
                  className={cn(
                    'h-11 border-white/12 bg-white/[0.03] pl-11 text-sm placeholder:text-white/30',
                    'focus-visible:ring-[#D4AF37]/60 focus-visible:border-[#D4AF37]/60'
                  )}
                  {...register('position')}
                />
              </div>
            </FieldWrapper> */}

            <FieldWrapper>
              <Label htmlFor="cf-email" className="font-mono2 text-[10px] uppercase tracking-[0.22em] text-white/55">
                Email Address <span className="text-[#D4AF37]">*</span>
              </Label>
              <div className="relative">
                <InputIcon Icon={Mail} hasError={!!errors.email} />
                <Input
                  id="cf-email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  className={cn(
                    'h-11 border-white/12 bg-white/[0.03] pl-11 text-sm placeholder:text-white/30',
                    'focus-visible:ring-[#D4AF37]/60 focus-visible:border-[#D4AF37]/60',
                    errors.email && 'border-red-400/60 focus-visible:ring-red-400/60'
                  )}
                  {...register('email')}
                />
              </div>
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </FieldWrapper>

            <FieldWrapper>
              <Label htmlFor="cf-phone" className="font-mono2 text-[10px] uppercase tracking-[0.22em] text-white/55">
                Phone Number <span className="text-[#D4AF37]">*</span>
              </Label>
              <div className="relative">
                <InputIcon Icon={Phone} hasError={!!errors.phone} />
                <Input
                  id="cf-phone"
                  type="tel"
                  placeholder="+1 555 123 4567"
                  autoComplete="tel"
                  className={cn(
                    'h-11 border-white/12 bg-white/[0.03] pl-11 text-sm placeholder:text-white/30',
                    'focus-visible:ring-[#D4AF37]/60 focus-visible:border-[#D4AF37]/60',
                    errors.phone && 'border-red-400/60 focus-visible:ring-red-400/60'
                  )}
                  {...register('phone')}
                />
              </div>
              {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
            </FieldWrapper>

            <FieldWrapper className="sm:col-span-2">
              <Label htmlFor="cf-country" className="font-mono2 text-[10px] uppercase tracking-[0.22em] text-white/55">
                Country / Region <span className="text-[#D4AF37]">*</span>
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-[#D4AF37]/70">
                  <MapPin className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <Select
                  value={selectedCountry}
                  onValueChange={(v) => {
                    try {
                      setValue('country', v, { shouldDirty: true, shouldValidate: true });
                    } catch (_) {}
                  }}
                >
                  <SelectTrigger
                    id="cf-country"
                    className={cn(
                      'h-11 border-white/12 bg-white/[0.03] pl-11 text-sm',
                      'focus:ring-[#D4AF37]/60 focus:border-[#D4AF37]/60',
                      !selectedCountry && 'text-white/40',
                      errors.country && 'border-red-400/60 focus:ring-red-400/60'
                    )}
                  >
                    <SelectValue placeholder="Select a country / region" />
                  </SelectTrigger>
                  <SelectContent
                    className="max-h-[320px] border-white/10 bg-[#111111] text-white"
                    position="popper"
                  >
                    {COUNTRIES.map((c) => (
                      <SelectItem
                        key={c.value}
                        value={c.value}
                        className="text-sm focus:bg-[#D4AF37]/15 focus:text-white data-[highlighted]:bg-[#D4AF37]/15"
                      >
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.country && <FieldError>{errors.country.message}</FieldError>}
            </FieldWrapper>



            <FieldWrapper className="sm:col-span-2">
              <Label htmlFor="cf-message" className="font-mono2 text-[10px] uppercase tracking-[0.22em] text-white/55">
                Message <span className="text-white/35">(Optional)</span>
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3.5 top-3.5 z-10 text-[#D4AF37]/70">
                  <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <Textarea
                  id="cf-message"
                  rows={6}
                  placeholder="Tell us about your requirements, quantities, destination port, timeline..."
                  className={cn(
                    'resize-none border-white/12 bg-white/[0.03] pl-11 pt-3.5 text-sm leading-relaxed placeholder:text-white/30',
                    'focus-visible:ring-[#D4AF37]/60 focus-visible:border-[#D4AF37]/60',
                    errors.message && 'border-red-400/60 focus-visible:ring-red-400/60'
                  )}
                  {...register('message')}
                />
              </div>
              {errors.message && <FieldError>{errors.message.message}</FieldError>}
            </FieldWrapper>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'group relative inline-flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-sm',
                'bg-[#D4AF37] text-[#0D0D0D] transition-all duration-300',
                'hover:bg-[#e6c451] active:scale-[0.99]',
                'disabled:cursor-not-allowed disabled:opacity-70'
              )}
            >
              <span
                className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-white/20 to-white/0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                aria-hidden="true"
              />
              {isSubmitting ? (
                <React.Fragment>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  <span className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.25em]">
                    Sending...
                  </span>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <span className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.25em]">
                    Send Message
                  </span>
                  <Check className="h-4 w-4" strokeWidth={2} />
                </React.Fragment>
              )}
            </button>
            {/* <p className="mt-4 text-center text-[11px] leading-relaxed text-white/30">
              By submitting this form, you agree to our privacy policy.
              Your details are never shared with third parties.
            </p> */}
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
