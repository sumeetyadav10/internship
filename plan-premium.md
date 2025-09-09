# Loan Form Management System - Premium Implementation Plan

## 🎯 Vision
Create a **premium, enterprise-grade** loan management system with a modern, sleek interface that rivals top financial software platforms. Focus on exceptional user experience, performance, and visual appeal.

## 🚀 Premium Tech Stack

### Frontend Excellence
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.0+ (strict mode)
- **Styling**: 
  - Tailwind CSS 3.4 with custom design system
  - Shadcn/ui for premium components
  - CSS-in-JS with Emotion for dynamic styles
- **State Management**: 
  - Zustand for global state
  - React Query (TanStack Query) for server state
  - React Hook Form with Zod validation
- **Animations**: 
  - Framer Motion for smooth transitions
  - Lottie for micro-animations
  - GSAP for complex animations
- **Charts**: Recharts + D3.js for custom visualizations
- **Icons**: Lucide React + custom SVG library

### Backend & Infrastructure
- **Database**: Firebase Firestore (existing)
- **Storage**: Firebase Storage with CDN
- **Auth**: Firebase Auth with MFA support
- **Real-time**: Firebase Realtime Database for live updates
- **Functions**: Firebase Cloud Functions for backend logic
- **Analytics**: Vercel Analytics + Custom dashboards
- **Monitoring**: Sentry for error tracking
- **CI/CD**: GitHub Actions + Vercel

## 🎨 Premium Design System

### Design Philosophy
- **Minimalist Luxury**: Clean, spacious layouts with thoughtful whitespace
- **Glass Morphism**: Subtle blur effects and transparency
- **Neumorphism Elements**: Soft shadows for depth
- **Dark Mode First**: Professional dark theme with light mode option

### Color Palette
```scss
// Primary Brand Colors
$primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
$primary-dark: #1a1b3a;
$primary-light: #7c3aed;

// Neutral Palette
$gray-900: #0f0f23;
$gray-800: #18182f;
$gray-700: #1e1e3f;
$gray-600: #2d2d54;
$gray-100: #f7fafc;

// Accent Colors
$success: #10b981;
$warning: #f59e0b;
$danger: #ef4444;
$info: #3b82f6;

// Glass Effect
$glass-bg: rgba(255, 255, 255, 0.05);
$glass-border: rgba(255, 255, 255, 0.1);
```

### Typography
```scss
// Font Stack
$font-primary: 'Inter', system-ui, -apple-system, sans-serif;
$font-display: 'Cal Sans', 'Inter', sans-serif;
$font-mono: 'JetBrains Mono', monospace;

// Type Scale
$text-xs: clamp(0.75rem, 0.8vw, 0.875rem);
$text-sm: clamp(0.875rem, 0.9vw, 1rem);
$text-base: clamp(1rem, 1vw, 1.125rem);
$text-lg: clamp(1.125rem, 1.2vw, 1.25rem);
$text-xl: clamp(1.25rem, 1.5vw, 1.5rem);
$text-2xl: clamp(1.5rem, 2vw, 2rem);
$text-3xl: clamp(2rem, 3vw, 3rem);
```

## 💎 Premium Features Implementation

### Phase 1: Foundation & Design System (Week 1)

#### 1.1 Project Setup
```bash
# Premium Next.js setup
npx create-next-app@latest loan-management-premium \
  --typescript --tailwind --app --src-dir \
  --import-alias "@/*"

# Premium dependencies
npm install @tanstack/react-query zustand framer-motion
npm install recharts d3 lucide-react
npm install @radix-ui/react-* # All Radix primitives
npm install react-hook-form @hookform/resolvers zod
npm install date-fns react-day-picker
npm install react-hot-toast sonner
npm install @sentry/nextjs
npm install sharp # Image optimization
```

#### 1.2 Design System Setup
- Custom Tailwind configuration with animations
- Component library with Storybook
- Design tokens for consistency
- Custom font loading with next/font
- SVG icon system with sprite sheets

#### 1.3 Premium Layout Components
```typescript
// Premium glass morphism card
export const GlassCard = ({ children, className }) => (
  <div className={cn(
    "backdrop-blur-xl bg-white/5",
    "border border-white/10 rounded-2xl",
    "shadow-2xl shadow-black/10",
    "transition-all duration-300 hover:bg-white/7",
    "hover:shadow-3xl hover:scale-[1.01]",
    className
  )}>
    {children}
  </div>
);

// Animated gradient button
export const GradientButton = ({ children, ...props }) => (
  <button
    className="relative px-8 py-3 rounded-xl font-medium
               bg-gradient-to-r from-purple-600 to-pink-600
               text-white shadow-lg shadow-purple-500/25
               hover:shadow-xl hover:shadow-purple-500/40
               transform transition-all duration-300
               hover:scale-105 active:scale-95
               before:absolute before:inset-0 before:rounded-xl
               before:bg-gradient-to-r before:from-purple-600 
               before:to-pink-600 before:blur-lg before:opacity-75
               hover:before:opacity-100 before:transition-opacity"
    {...props}
  >
    <span className="relative z-10">{children}</span>
  </button>
);
```

### Phase 2: Premium Authentication Experience (Week 1-2)

#### 2.1 Animated Login Page
- Particle.js background with floating shapes
- Glassmorphism login card
- Smooth form transitions
- Password strength indicator with animations
- Biometric authentication support
- Magic link authentication option
- Social login with animated buttons

#### 2.2 Onboarding Flow
- Step-by-step animated walkthrough
- Progress indicators with smooth transitions
- Personalization questions
- Interactive tutorials with Shepherd.js
- Welcome animation with Lottie

### Phase 3: Premium Dashboard (Week 2-3)

#### 3.1 Dashboard Layout
```typescript
// Premium dashboard grid
<div className="grid grid-cols-12 gap-6 p-6">
  {/* Animated Stats Cards */}
  <div className="col-span-12 lg:col-span-3">
    <AnimatedStatCard
      title="Total Applications"
      value={stats.total}
      change={stats.change}
      icon={<TrendingUp />}
      gradient="from-blue-500 to-purple-500"
    />
  </div>
  
  {/* Real-time Activity Feed */}
  <div className="col-span-12 lg:col-span-4">
    <GlassCard>
      <ActivityFeed activities={realtimeActivities} />
    </GlassCard>
  </div>
  
  {/* Interactive Charts */}
  <div className="col-span-12 lg:col-span-5">
    <GlassCard>
      <InteractiveChart data={chartData} />
    </GlassCard>
  </div>
</div>
```

#### 3.2 Premium Components
- **Animated Number Counters**: Count up animations for statistics
- **Live Activity Feed**: Real-time updates with smooth transitions
- **Interactive Charts**: 
  - Hover effects with detailed tooltips
  - Drill-down capabilities
  - Animated transitions between data sets
  - Custom D3.js visualizations
- **Weather Widget**: Shows local weather (premium touch)
- **Quick Actions**: Floating action button with radial menu

### Phase 4: Advanced Form Experience (Week 3-4)

#### 4.1 Multi-Step Form with Database Fields
Based on the Firestore database structure, the loan application form will have the following steps:

```typescript
// Form steps based on actual database structure
const formSteps = [
  { id: 'applicant', title: 'Applicant Details', icon: User },
  { id: 'address', title: 'Address Information', icon: MapPin },
  { id: 'loan', title: 'Loan Details', icon: Calculator },
  { id: 'surety', title: 'Surety Details', icon: Shield },
  { id: 'documents', title: 'Document Upload', icon: FileUpload }
];

// Premium form with step animations
export const PremiumLoanForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<LoanApplication>({
    applicantDetails: {},
    loanDetails: {},
    suretyDetails: {},
    documents: {},
    status: 'draft'
  });
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {formSteps.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <motion.div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  "border-2 transition-all duration-300",
                  i <= step ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg shadow-purple-500/30" 
                           : "border-gray-600 text-gray-400 bg-gray-800/50"
                )}
                animate={{
                  scale: i === step ? 1.2 : 1,
                }}
                whileHover={{ scale: 1.1 }}
                onClick={() => i <= step && setStep(i)}
              >
                {i < step ? <Check className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
              </motion.div>
              {i < formSteps.length - 1 && (
                <motion.div
                  className="flex-1 h-0.5 mx-3"
                  style={{
                    background: i < step 
                      ? "linear-gradient(90deg, #7c3aed 0%, #db2777 100%)"
                      : "#374151"
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          {formSteps.map((s, i) => (
            <div key={i} className="text-center flex-1">
              <p className={cn(
                "text-sm font-medium transition-colors",
                i === step ? "text-purple-400" : "text-gray-500"
              )}>
                {s.title}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Animated Form Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <GlassCard className="p-8">
            {step === 0 && <ApplicantDetailsStep formData={formData} setFormData={setFormData} />}
            {step === 1 && <AddressDetailsStep formData={formData} setFormData={setFormData} />}
            {step === 2 && <LoanDetailsStep formData={formData} setFormData={setFormData} />}
            {step === 3 && <SuretyDetailsStep formData={formData} setFormData={setFormData} />}
            {step === 4 && <DocumentUploadStep formData={formData} setFormData={setFormData} />}
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
```

#### 4.2 Step 1: Applicant Details Form Fields
```typescript
// Based on actual database fields
export const ApplicantDetailsStep = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Applicant Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Loan Account Number */}
        <FormField>
          <Label>Loan Account Number</Label>
          <Input 
            placeholder="LN2024XXX"
            value={formData.applicantDetails.loanAccountNo}
            onChange={(e) => updateField('applicantDetails.loanAccountNo', e.target.value)}
            className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
          />
        </FormField>

        {/* Year */}
        <FormField>
          <Label>Application Year</Label>
          <Select value={formData.applicantDetails.year} onValueChange={(v) => updateField('applicantDetails.year', v)}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        {/* Salutation */}
        <FormField>
          <Label>Salutation</Label>
          <RadioGroup value={formData.applicantDetails.salutation} onValueChange={(v) => updateField('applicantDetails.salutation', v)}>
            <div className="flex gap-4">
              <RadioItem value="Mr" label="Mr." />
              <RadioItem value="Ms" label="Ms." />
              <RadioItem value="Mrs" label="Mrs." />
              <RadioItem value="Dr" label="Dr." />
            </div>
          </RadioGroup>
        </FormField>

        {/* Name Fields */}
        <FormField>
          <Label>First Name*</Label>
          <Input 
            required
            placeholder="Enter first name"
            value={formData.applicantDetails.firstName}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        <FormField>
          <Label>Middle Name</Label>
          <Input 
            placeholder="Enter middle name"
            value={formData.applicantDetails.middleName}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        <FormField>
          <Label>Last Name*</Label>
          <Input 
            required
            placeholder="Enter last name"
            value={formData.applicantDetails.lastName}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        {/* Contact Fields */}
        <FormField>
          <Label>Mobile Number*</Label>
          <Input 
            type="tel"
            required
            placeholder="10-digit mobile number"
            pattern="[0-9]{10}"
            value={formData.applicantDetails.mobileNo}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        <FormField>
          <Label>Email Address*</Label>
          <Input 
            type="email"
            required
            placeholder="email@example.com"
            value={formData.applicantDetails.email}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        <FormField>
          <Label>Aadhar Number*</Label>
          <Input 
            required
            placeholder="12-digit Aadhar number"
            pattern="[0-9]{12}"
            maxLength={12}
            value={formData.applicantDetails.aadharNo}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        {/* Business Fields */}
        <FormField className="md:col-span-2">
          <Label>Industry/Business Name*</Label>
          <Input 
            required
            placeholder="Enter your business name"
            value={formData.applicantDetails.industryName}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        <FormField>
          <Label>Working Sheet/Category</Label>
          <Input 
            placeholder="Business category"
            value={formData.applicantDetails.workingsheet}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>
      </div>
    </div>
  );
};
```

#### 4.3 Step 2: Address Details with Masters Integration
```typescript
export const AddressDetailsStep = ({ formData, setFormData }) => {
  const { districts, talukas, villages } = useMasters();
  const [filteredTalukas, setFilteredTalukas] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);
  
  // Filter talukas based on selected district
  useEffect(() => {
    if (formData.applicantDetails.district) {
      setFilteredTalukas(talukas.filter(t => t.districtCode === formData.applicantDetails.district));
    }
  }, [formData.applicantDetails.district]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Address Information
      </h2>
      
      {/* Present Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-300">Present Address</h3>
        
        <FormField>
          <Label>Address Line*</Label>
          <Textarea 
            required
            placeholder="Enter complete address"
            value={formData.applicantDetails.presentAddress}
            className="bg-gray-800/50 border-gray-700 min-h-[100px]"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* District Dropdown */}
          <FormField>
            <Label>District*</Label>
            <Select value={formData.applicantDetails.district} onValueChange={(v) => {
              updateField('applicantDetails.district', v);
              updateField('applicantDetails.taluka', ''); // Reset taluka
              updateField('applicantDetails.villageCity', ''); // Reset village
            }}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map(d => (
                  <SelectItem key={d.code} value={d.code}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Taluka Dropdown */}
          <FormField>
            <Label>Taluka*</Label>
            <Select 
              value={formData.applicantDetails.taluka} 
              disabled={!formData.applicantDetails.district}
              onValueChange={(v) => {
                updateField('applicantDetails.taluka', v);
                updateField('applicantDetails.villageCity', ''); // Reset village
              }}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-700">
                <SelectValue placeholder="Select taluka" />
              </SelectTrigger>
              <SelectContent>
                {filteredTalukas.map(t => (
                  <SelectItem key={t.code} value={t.code}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Village/City Dropdown */}
          <FormField>
            <Label>Village/City*</Label>
            <Select 
              value={formData.applicantDetails.villageCity}
              disabled={!formData.applicantDetails.taluka}
              onValueChange={(v) => {
                updateField('applicantDetails.villageCity', v);
                // Auto-fill pincode
                const village = villages.find(vil => vil.name === v);
                if (village) {
                  updateField('applicantDetails.pincode', village.pincode);
                }
              }}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-700">
                <SelectValue placeholder="Select village/city" />
              </SelectTrigger>
              <SelectContent>
                {filteredVillages.map(v => (
                  <SelectItem key={v.code} value={v.name}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Pincode */}
          <FormField>
            <Label>Pincode*</Label>
            <Input 
              required
              placeholder="6-digit pincode"
              pattern="[0-9]{6}"
              maxLength={6}
              value={formData.applicantDetails.pincode}
              className="bg-gray-800/50 border-gray-700"
            />
          </FormField>
        </div>
      </div>

      {/* Permanent Address */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-300">Permanent Address</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch
              checked={formData.applicantDetails.sameAsPermanent}
              onCheckedChange={(checked) => {
                updateField('applicantDetails.sameAsPermanent', checked);
                if (checked) {
                  updateField('applicantDetails.permanentAddress', formData.applicantDetails.presentAddress);
                }
              }}
            />
            <span className="text-sm text-gray-400">Same as present address</span>
          </label>
        </div>
        
        {!formData.applicantDetails.sameAsPermanent && (
          <FormField>
            <Label>Permanent Address*</Label>
            <Textarea 
              required
              placeholder="Enter permanent address"
              value={formData.applicantDetails.permanentAddress}
              className="bg-gray-800/50 border-gray-700 min-h-[100px]"
            />
          </FormField>
        )}
      </div>
    </div>
  );
};
```

#### 4.4 Step 3: Loan Details Form
```typescript
export const LoanDetailsStep = ({ formData, setFormData }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Calculate total amount whenever any field changes
  useEffect(() => {
    const total = 
      parseFloat(formData.loanDetails.workingCapital2 || 0) +
      parseFloat(formData.loanDetails.katchaStructure2 || 0) +
      parseFloat(formData.loanDetails.machinery2 || 0) +
      parseFloat(formData.loanDetails.godown2 || 0) +
      parseFloat(formData.loanDetails.grant2 || 0);
    
    setTotalAmount(total);
    updateField('loanDetails.totalAmount', total);
    updateField('loanDetails.totalInWords', numberToWords(total));
  }, [
    formData.loanDetails.workingCapital2,
    formData.loanDetails.katchaStructure2,
    formData.loanDetails.machinery2,
    formData.loanDetails.godown2,
    formData.loanDetails.grant2
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Loan Details
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-4 px-6 text-gray-400">Particulars</th>
              <th className="text-center py-4 px-6 text-gray-400">Description</th>
              <th className="text-center py-4 px-6 text-gray-400">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {/* Working Capital */}
            <tr className="hover:bg-gray-800/30 transition-colors">
              <td className="py-4 px-6 font-medium">Working Capital</td>
              <td className="py-4 px-6">
                <Input 
                  placeholder="Purpose/Description"
                  value={formData.loanDetails.workingCapital1}
                  className="bg-gray-800/50 border-gray-700 w-full"
                />
              </td>
              <td className="py-4 px-6">
                <Input 
                  type="number"
                  placeholder="0"
                  value={formData.loanDetails.workingCapital2}
                  onChange={(e) => updateField('loanDetails.workingCapital2', e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-right w-full"
                />
              </td>
            </tr>

            {/* Katcha Structure */}
            <tr className="hover:bg-gray-800/30 transition-colors">
              <td className="py-4 px-6 font-medium">Katcha Structure</td>
              <td className="py-4 px-6">
                <Input 
                  placeholder="Purpose/Description"
                  value={formData.loanDetails.katchaStructure1}
                  className="bg-gray-800/50 border-gray-700 w-full"
                />
              </td>
              <td className="py-4 px-6">
                <Input 
                  type="number"
                  placeholder="0"
                  value={formData.loanDetails.katchaStructure2}
                  className="bg-gray-800/50 border-gray-700 text-right w-full"
                />
              </td>
            </tr>

            {/* Machinery */}
            <tr className="hover:bg-gray-800/30 transition-colors">
              <td className="py-4 px-6 font-medium">Machinery</td>
              <td className="py-4 px-6">
                <Input 
                  placeholder="Purpose/Description"
                  value={formData.loanDetails.machinery1}
                  className="bg-gray-800/50 border-gray-700 w-full"
                />
              </td>
              <td className="py-4 px-6">
                <Input 
                  type="number"
                  placeholder="0"
                  value={formData.loanDetails.machinery2}
                  className="bg-gray-800/50 border-gray-700 text-right w-full"
                />
              </td>
            </tr>

            {/* Godown */}
            <tr className="hover:bg-gray-800/30 transition-colors">
              <td className="py-4 px-6 font-medium">Godown</td>
              <td className="py-4 px-6">
                <Input 
                  placeholder="Purpose/Description"
                  value={formData.loanDetails.godown1}
                  className="bg-gray-800/50 border-gray-700 w-full"
                />
              </td>
              <td className="py-4 px-6">
                <Input 
                  type="number"
                  placeholder="0"
                  value={formData.loanDetails.godown2}
                  className="bg-gray-800/50 border-gray-700 text-right w-full"
                />
              </td>
            </tr>

            {/* Grant */}
            <tr className="hover:bg-gray-800/30 transition-colors">
              <td className="py-4 px-6 font-medium">Grant</td>
              <td className="py-4 px-6">
                <Input 
                  placeholder="Purpose/Description"
                  value={formData.loanDetails.grant1}
                  className="bg-gray-800/50 border-gray-700 w-full"
                />
              </td>
              <td className="py-4 px-6">
                <Input 
                  type="number"
                  placeholder="0"
                  value={formData.loanDetails.grant2}
                  className="bg-gray-800/50 border-gray-700 text-right w-full"
                />
              </td>
            </tr>

            {/* Total */}
            <tr className="bg-gray-800/50 font-bold">
              <td className="py-4 px-6" colSpan={2}>Total Amount</td>
              <td className="py-4 px-6 text-right text-xl text-purple-400">
                ₹{totalAmount.toLocaleString('en-IN')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Amount in Words */}
      <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
        <p className="text-sm text-gray-400">Total Amount in Words:</p>
        <p className="text-lg font-medium text-purple-300">{formData.loanDetails.totalInWords}</p>
      </div>
    </div>
  );
};
```

#### 4.5 Step 4: Surety Details Form
```typescript
export const SuretyDetailsStep = ({ formData, setFormData }) => {
  const { districts, talukas, villages } = useMasters();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Surety/Guarantor Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <FormField className="md:col-span-2">
          <Label>Surety Name*</Label>
          <Input 
            required
            placeholder="Full name of guarantor"
            value={formData.suretyDetails.suretyName}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        <FormField>
          <Label>Relation with Applicant*</Label>
          <Input 
            required
            placeholder="e.g., Father, Brother, Friend"
            value={formData.suretyDetails.relation}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        <FormField>
          <Label>Occupation*</Label>
          <Input 
            required
            placeholder="Current occupation"
            value={formData.suretyDetails.occupation}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        <FormField>
          <Label>Designation</Label>
          <Input 
            placeholder="Job title/position"
            value={formData.suretyDetails.designation}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        <FormField>
          <Label>Employer</Label>
          <Input 
            placeholder="Company/Organization name"
            value={formData.suretyDetails.employer}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        {/* Contact Information */}
        <FormField>
          <Label>Mobile Number*</Label>
          <Input 
            type="tel"
            required
            placeholder="10-digit mobile"
            pattern="[0-9]{10}"
            value={formData.suretyDetails.mobileNo}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        <FormField>
          <Label>Email</Label>
          <Input 
            type="email"
            placeholder="email@example.com"
            value={formData.suretyDetails.email}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        <FormField>
          <Label>Aadhar Number*</Label>
          <Input 
            required
            placeholder="12-digit Aadhar"
            pattern="[0-9]{12}"
            maxLength={12}
            value={formData.suretyDetails.aadharNo}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        <FormField>
          <Label>PAN Number</Label>
          <Input 
            placeholder="10-character PAN"
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            maxLength={10}
            value={formData.suretyDetails.panNo}
            className="bg-gray-800/50 border-gray-700 uppercase"
          />
        </FormField>

        {/* Address Fields */}
        <FormField className="md:col-span-3">
          <Label>Residential Address*</Label>
          <Textarea 
            required
            placeholder="Complete residential address"
            value={formData.suretyDetails.residentialAddress}
            className="bg-gray-800/50 border-gray-700 min-h-[80px]"
          />
        </FormField>

        <FormField className="md:col-span-3">
          <Label>Work Address</Label>
          <Textarea 
            placeholder="Office/Work address"
            value={formData.suretyDetails.workAddress}
            className="bg-gray-800/50 border-gray-700 min-h-[80px]"
          />
        </FormField>

        {/* Location Dropdowns */}
        <FormField>
          <Label>District*</Label>
          <Select value={formData.suretyDetails.district}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {districts.map(d => (
                <SelectItem key={d.code} value={d.code}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField>
          <Label>Taluka*</Label>
          <Select value={formData.suretyDetails.taluka}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700">
              <SelectValue placeholder="Select taluka" />
            </SelectTrigger>
            <SelectContent>
              {/* Filtered talukas based on district */}
            </SelectContent>
          </Select>
        </FormField>

        <FormField>
          <Label>Village/City*</Label>
          <Input 
            required
            placeholder="Village or city name"
            value={formData.suretyDetails.villageCity}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        <FormField>
          <Label>Pincode*</Label>
          <Input 
            required
            placeholder="6-digit pincode"
            pattern="[0-9]{6}"
            maxLength={6}
            value={formData.suretyDetails.pincode}
            className="bg-gray-800/50 border-gray-700"
          />
        </FormField>

        {/* Financial Information */}
        <div className="md:col-span-3 space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">Financial Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField>
              <Label>Monthly Salary</Label>
              <Input 
                placeholder="Monthly income"
                value={formData.suretyDetails.monthlySalary}
                className="bg-gray-800/50 border-gray-700"
              />
            </FormField>

            <FormField>
              <Label>Other Income</Label>
              <Input 
                placeholder="Additional income"
                value={formData.suretyDetails.otherIncome}
                className="bg-gray-800/50 border-gray-700"
              />
            </FormField>

            <FormField>
              <Label>Existing Liabilities</Label>
              <Input 
                placeholder="Current loans/EMIs"
                value={formData.suretyDetails.existingLiabilities}
                className="bg-gray-800/50 border-gray-700"
              />
            </FormField>

            <FormField>
              <Label>Employment Duration</Label>
              <Input 
                placeholder="Years in current job"
                value={formData.suretyDetails.employmentDuration}
                className="bg-gray-800/50 border-gray-700"
              />
            </FormField>

            <FormField className="md:col-span-2">
              <Label>Property Details</Label>
              <Textarea 
                placeholder="Details of owned properties"
                value={formData.suretyDetails.propertyDetails}
                className="bg-gray-800/50 border-gray-700"
              />
            </FormField>
          </div>
        </div>

        {/* Bank Details */}
        <div className="md:col-span-3 space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">Bank Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField>
              <Label>Bank Name*</Label>
              <Input 
                required
                placeholder="Name of the bank"
                value={formData.suretyDetails.bankName}
                className="bg-gray-800/50 border-gray-700"
              />
            </FormField>

            <FormField>
              <Label>Branch*</Label>
              <Input 
                required
                placeholder="Branch name"
                value={formData.suretyDetails.bankBranch}
                className="bg-gray-800/50 border-gray-700"
              />
            </FormField>

            <FormField>
              <Label>Account Number*</Label>
              <Input 
                required
                placeholder="Bank account number"
                value={formData.suretyDetails.accountNo}
                className="bg-gray-800/50 border-gray-700"
              />
            </FormField>

            <FormField>
              <Label>Banker Name</Label>
              <Input 
                placeholder="Contact person at bank"
                value={formData.suretyDetails.bankerName}
                className="bg-gray-800/50 border-gray-700"
              />
            </FormField>

            <FormField>
              <Label>Existing Loan with Bank</Label>
              <Input 
                placeholder="Current loan details"
                value={formData.suretyDetails.suretyLoan}
                className="bg-gray-800/50 border-gray-700"
              />
            </FormField>
          </div>
        </div>
      </div>
    </div>
  );
};
```

#### 4.6 Step 5: Document Upload with Premium UI
```typescript
export const DocumentUploadStep = ({ formData, setFormData }) => {
  // Document types based on database structure
  const documentTypes = [
    {
      category: 'Applicant Documents',
      documents: [
        { id: 'applicantPan', label: 'PAN Card', icon: CreditCard, required: true },
        { id: 'applicantAadhar', label: 'Aadhar Card', icon: IdCard, required: true },
        { id: 'applicantPhoto', label: 'Passport Photo', icon: Camera, required: true },
        { id: 'incomeCertificate', label: 'Income Certificate', icon: FileText, required: true },
        { id: 'bankStatement', label: 'Bank Statement', icon: Building, required: false },
        { id: 'businessLicense', label: 'Business License', icon: Briefcase, required: false },
        { id: 'propertyPapers', label: 'Property Papers', icon: Home, required: false }
      ]
    },
    {
      category: 'Surety Documents',
      documents: [
        { id: 'suretyPan', label: 'Surety PAN Card', icon: CreditCard, required: true },
        { id: 'suretyAadhar', label: 'Surety Aadhar Card', icon: IdCard, required: true },
        { id: 'suretyPhoto', label: 'Surety Photo', icon: Camera, required: true },
        { id: 'suretyIncome', label: 'Surety Income Proof', icon: DollarSign, required: false }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Document Upload
      </h2>
      
      {documentTypes.map((category) => (
        <div key={category.category} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">{category.category}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.documents.map((doc) => (
              <DocumentUploadCard
                key={doc.id}
                document={doc}
                value={formData.documents[doc.id]}
                onChange={(file) => updateDocument(doc.id, file)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Premium Document Upload Card Component
const DocumentUploadCard = ({ document, value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl border-2 border-dashed transition-all",
        isDragging ? "border-purple-500 bg-purple-500/10" : "border-gray-700 bg-gray-800/30",
        value && "border-solid border-green-500/50 bg-green-500/10"
      )}
      whileHover={{ scale: 1.02 }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files[0]);
      }}
    >
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            value ? "bg-green-500/20" : "bg-gray-700"
          )}>
            <document.icon className={cn(
              "w-6 h-6",
              value ? "text-green-400" : "text-gray-400"
            )} />
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium text-gray-200">
              {document.label}
              {document.required && <span className="text-red-400 ml-1">*</span>}
            </h4>
            {value ? (
              <div className="mt-1 space-y-1">
                <p className="text-sm text-green-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {value.fileName}
                </p>
                <p className="text-xs text-gray-500">
                  Uploaded on {new Date(value.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">
                Drag & drop or click to upload
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              className="hidden"
              id={`file-${document.id}`}
            />
            <label
              htmlFor={`file-${document.id}`}
              className="cursor-pointer p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <Upload className="w-5 h-5 text-gray-300" />
            </label>
            {value && (
              <button
                onClick={() => window.open(value.url, '_blank')}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <Eye className="w-5 h-5 text-gray-300" />
              </button>
            )}
          </div>
        </div>
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{uploadProgress}% uploaded</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
```

### Phase 5: Masters Management Premium UI (Week 4)

#### 5.1 Masters Data Structure
Based on your Firestore database, the masters management will handle:
- **Districts**: 2 records (North Goa, South Goa)
- **Talukas**: 12 records linked to districts
- **Villages**: 317 records linked to talukas

#### 5.2 Premium Masters Management Interface
```typescript
export const MastersManagement = () => {
  const [activeTab, setActiveTab] = useState('districts');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* Header with Search and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Masters Management
          </h1>
          <p className="text-gray-400 mt-1">Manage districts, talukas, and villages</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800/50 border-gray-700 rounded-lg w-64"
            />
          </div>
          
          <GradientButton onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </GradientButton>
          
          <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Animated Tabs */}
      <div className="flex gap-1 p-1 bg-gray-800/50 rounded-lg">
        {['districts', 'talukas', 'villages'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 px-4 py-2 rounded-md font-medium capitalize transition-all",
              activeTab === tab
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "text-gray-400 hover:text-gray-200"
            )}
          >
            {tab}
            <span className="ml-2 text-sm opacity-70">
              ({tab === 'districts' ? 2 : tab === 'talukas' ? 12 : 317})
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'districts' && <DistrictsManager searchQuery={searchQuery} />}
          {activeTab === 'talukas' && <TalukasManager searchQuery={searchQuery} />}
          {activeTab === 'villages' && <VillagesManager searchQuery={searchQuery} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Districts Management Component
const DistrictsManager = ({ searchQuery }) => {
  const [districts, setDistricts] = useState([
    { code: 'NG', name: 'North Goa', active: true, talukaCount: 6, villageCount: 150 },
    { code: 'SG', name: 'South Goa', active: true, talukaCount: 6, villageCount: 167 }
  ]);

  return (
    <div className="grid gap-4">
      {districts.map((district, index) => (
        <motion.div
          key={district.code}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard className="p-6 hover:shadow-2xl hover:shadow-purple-500/10 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {district.code}
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-100">{district.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-400">
                      <Building className="w-4 h-4 inline mr-1" />
                      {district.talukaCount} Talukas
                    </span>
                    <span className="text-sm text-gray-400">
                      <Home className="w-4 h-4 inline mr-1" />
                      {district.villageCount} Villages
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Switch
                  checked={district.active}
                  onCheckedChange={(checked) => updateDistrictStatus(district.code, checked)}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
                />
                
                <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                
                <button className="p-2 rounded-lg bg-gray-700 hover:bg-red-600 transition-colors">
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};

// Talukas Management Component
const TalukasManager = ({ searchQuery }) => {
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [talukas] = useState([
    { code: 'TPM', name: 'Tiswadi', districtCode: 'NG', active: true, villageCount: 25 },
    { code: 'BDZ', name: 'Bardez', districtCode: 'NG', active: true, villageCount: 30 },
    // ... more talukas
  ]);

  return (
    <div className="space-y-4">
      {/* District Filter */}
      <div className="flex items-center gap-4">
        <Label>Filter by District:</Label>
        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
          <SelectTrigger className="w-48 bg-gray-800/50 border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            <SelectItem value="NG">North Goa</SelectItem>
            <SelectItem value="SG">South Goa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Talukas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {talukas
          .filter(t => selectedDistrict === 'all' || t.districtCode === selectedDistrict)
          .map((taluka, index) => (
            <motion.div
              key={taluka.code}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-5 hover:scale-105 transition-transform">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-100">{taluka.name}</h4>
                    <p className="text-sm text-gray-400">Code: {taluka.code}</p>
                  </div>
                  <Switch
                    checked={taluka.active}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    District: {taluka.districtCode === 'NG' ? 'North Goa' : 'South Goa'}
                  </span>
                  <span className="text-purple-400">{taluka.villageCount} villages</span>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-sm">
                    Edit
                  </button>
                  <button className="flex-1 py-1.5 rounded-md bg-gray-700 hover:bg-red-600 transition-colors text-sm">
                    Delete
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

// Villages Management with Virtual Scrolling
const VillagesManager = ({ searchQuery }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    district: 'all',
    taluka: 'all'
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={selectedFilters.district} onValueChange={(v) => setSelectedFilters({...selectedFilters, district: v})}>
          <SelectTrigger className="bg-gray-800/50 border-gray-700">
            <SelectValue placeholder="Select District" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            <SelectItem value="NG">North Goa</SelectItem>
            <SelectItem value="SG">South Goa</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedFilters.taluka} disabled={selectedFilters.district === 'all'}>
          <SelectTrigger className="bg-gray-800/50 border-gray-700">
            <SelectValue placeholder="Select Taluka" />
          </SelectTrigger>
          <SelectContent>
            {/* Dynamic talukas based on district */}
          </SelectContent>
        </Select>
        
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors">
          <Filter className="w-4 h-4" />
          Advanced Filters
        </button>
      </div>

      {/* Villages Table with Virtual Scrolling */}
      <GlassCard className="overflow-hidden">
        <VirtualTable
          data={villages}
          columns={[
            { key: 'code', header: 'Code', width: 100 },
            { key: 'name', header: 'Village Name', width: 200 },
            { key: 'talukaCode', header: 'Taluka', width: 150 },
            { key: 'districtCode', header: 'District', width: 150 },
            { key: 'pincode', header: 'Pincode', width: 100 },
            { key: 'active', header: 'Status', width: 100, render: (value) => (
              <span className={cn(
                "px-2 py-1 rounded-full text-xs",
                value ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              )}>
                {value ? 'Active' : 'Inactive'}
              </span>
            )},
            { key: 'actions', header: 'Actions', width: 120, render: (_, row) => (
              <div className="flex gap-2">
                <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 rounded hover:bg-red-600 transition-colors">
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            )}
          ]}
          rowHeight={60}
          height={600}
        />
      </GlassCard>
    </div>
  );
};

// Add/Edit Modal Component
const LocationModal = ({ type, data, onSave, onClose }) => {
  const [formData, setFormData] = useState(data || {});
  
  return (
    <Modal isOpen onClose={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">
          {data ? 'Edit' : 'Add'} {type}
        </h2>
        
        <form className="space-y-4">
          <FormField>
            <Label>Code*</Label>
            <Input
              value={formData.code || ''}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              className="bg-gray-800/50 border-gray-700"
              placeholder="Enter unique code"
            />
          </FormField>
          
          <FormField>
            <Label>Name*</Label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-gray-800/50 border-gray-700"
              placeholder="Enter name"
            />
          </FormField>
          
          {type !== 'district' && (
            <FormField>
              <Label>{type === 'taluka' ? 'District' : 'Taluka'}*</Label>
              <Select value={formData.parentCode || ''}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700">
                  <SelectValue placeholder={`Select ${type === 'taluka' ? 'district' : 'taluka'}`} />
                </SelectTrigger>
                <SelectContent>
                  {/* Dynamic options based on type */}
                </SelectContent>
              </Select>
            </FormField>
          )}
          
          {type === 'village' && (
            <FormField>
              <Label>Pincode*</Label>
              <Input
                value={formData.pincode || ''}
                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                className="bg-gray-800/50 border-gray-700"
                placeholder="6-digit pincode"
                maxLength={6}
              />
            </FormField>
          )}
          
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({...formData, active: checked})}
            />
            <Label>Active</Label>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <GradientButton
              type="submit"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault();
                onSave(formData);
              }}
            >
              Save
            </GradientButton>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
};
```

#### 5.3 Premium Features for Masters Management
- **Bulk Import/Export**: 
  - CSV/Excel import with validation
  - Progress bar for large imports
  - Error handling with row-level feedback
- **Hierarchical View**: Tree structure visualization
- **Search & Filter**: 
  - Real-time search across all fields
  - Advanced filters with save/load
- **Audit Trail**: Track all changes with user info
- **Batch Operations**: Select multiple items for bulk actions
- **Data Validation**: Prevent duplicate codes and maintain relationships

### Phase 5: Premium Data Tables (Week 4)

#### 5.1 Advanced DataGrid
```typescript
// Premium data table with animations
export const PremiumDataTable = ({ data, columns }) => {
  return (
    <div className="rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((col) => (
              <th className="px-6 py-4 text-left">
                <div className="flex items-center gap-2">
                  {col.header}
                  {col.sortable && (
                    <button className="hover:text-purple-400 transition-colors">
                      <ArrowUpDown size={14} />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {data.map((row, i) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                {columns.map((col) => (
                  <td className="px-6 py-4">{row[col.key]}</td>
                ))}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};
```

#### 5.2 Table Features
- **Virtual Scrolling**: Handle thousands of rows smoothly
- **Column Resizing**: Drag to resize with visual feedback
- **Advanced Filters**: 
  - Multi-select dropdowns
  - Date range pickers
  - Search with highlighting
- **Bulk Actions**: Select multiple with animations
- **Export Options**: PDF, Excel, CSV with progress
- **Inline Editing**: Click to edit with smooth transitions

### Phase 6: Real-time Features (Week 5)

#### 6.1 Live Collaboration
- See who's viewing the same application
- Real-time cursor tracking
- Live typing indicators
- Collaborative comments

#### 6.2 Notifications System
```typescript
// Premium notification system
export const NotificationCenter = () => {
  const { notifications } = useNotifications();
  
  return (
    <AnimatePresence>
      {notifications.map((notif) => (
        <motion.div
          key={notif.id}
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="mb-4"
        >
          <GlassCard className="p-4 flex items-start gap-3">
            <div className={cn(
              "w-2 h-2 rounded-full mt-2",
              notif.type === 'success' && "bg-green-500",
              notif.type === 'error' && "bg-red-500",
              notif.type === 'info' && "bg-blue-500"
            )} />
            <div className="flex-1">
              <h4 className="font-medium">{notif.title}</h4>
              <p className="text-sm text-gray-400">{notif.message}</p>
            </div>
            <button className="text-gray-500 hover:text-white">
              <X size={16} />
            </button>
          </GlassCard>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};
```

### Phase 7: Advanced Analytics (Week 5-6)

#### 7.1 Analytics Dashboard
- **AI-Powered Insights**: Automatic trend detection
- **Predictive Analytics**: Loan approval predictions
- **Custom Report Builder**: Drag-and-drop report creation
- **Interactive Heatmaps**: Geographic distribution
- **Funnel Analysis**: Application process optimization
- **Cohort Analysis**: User behavior patterns

#### 7.2 Visualization Components
- 3D charts with Three.js
- Animated flow diagrams
- Interactive network graphs
- Real-time performance metrics
- Custom KPI widgets

### Phase 8: Mobile Excellence (Week 6)

#### 8.1 Progressive Web App
- Offline functionality
- Push notifications
- App-like experience
- Install prompts
- Background sync

#### 8.2 Mobile-First Features
- Swipe gestures for navigation
- Touch-optimized forms
- Haptic feedback
- Bottom sheet modals
- Pull-to-refresh

### Phase 9: Security & Performance (Week 7)

#### 9.1 Premium Security
- **Biometric Authentication**: Face ID, Touch ID
- **Session Recording**: For security audits
- **IP Whitelisting**: Restrict access
- **Audit Logs**: Detailed activity tracking
- **Encryption**: End-to-end for sensitive data
- **2FA/MFA**: Multiple options (SMS, TOTP, WebAuthn)

#### 9.2 Performance Features
- **Edge Caching**: Vercel Edge Network
- **Image Optimization**: Next.js Image with blur placeholders
- **Code Splitting**: Route-based and component-based
- **Prefetching**: Smart link prefetching
- **Web Vitals Monitoring**: Real-time performance tracking
- **Bundle Analysis**: Continuous optimization

## 🎭 Micro-interactions & Animations

### Button Interactions
```scss
.premium-button {
  // Magnetic effect on hover
  @hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
  }
  
  // Ripple effect on click
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
    transform: scale(0);
    animation: ripple 0.6s ease-out;
  }
}
```

### Page Transitions
- Smooth fade with scale
- Directional sliding
- Morph transitions between states
- Parallax scrolling effects
- Reveal animations on scroll

### Loading States
- Skeleton screens with shimmer
- Progress bars with particles
- Spinning logos with glow
- Step-by-step loading sequences

## 🎯 Success Metrics

### Performance Targets
- **First Contentful Paint**: < 1.2s
- **Time to Interactive**: < 2.5s
- **Lighthouse Score**: > 95
- **Bundle Size**: < 200KB (initial)

### User Experience
- **Task Completion Rate**: > 95%
- **Error Rate**: < 1%
- **User Satisfaction**: > 4.8/5
- **Accessibility Score**: WCAG AAA

### Business Metrics
- **Processing Time**: 70% reduction
- **User Adoption**: > 90% in 3 months
- **Support Tickets**: 50% reduction
- **ROI**: 300% in first year

## 🚀 Deployment Strategy

### Infrastructure
- **Hosting**: Vercel Pro (Enterprise features)
- **CDN**: Cloudflare Enterprise
- **Monitoring**: Datadog + Sentry
- **Analytics**: Plausible + Custom

### Launch Plan
1. **Alpha Testing**: Internal team (Week 7)
2. **Beta Testing**: Select users (Week 8)
3. **Soft Launch**: 10% rollout (Week 9)
4. **Full Launch**: 100% with marketing (Week 10)

## 💰 Premium Pricing Tiers

### Starter (Free)
- Up to 10 applications/month
- Basic features
- Community support

### Professional ($49/month)
- Unlimited applications
- Advanced analytics
- Priority support
- Custom branding

### Enterprise (Custom)
- White-label solution
- Dedicated infrastructure
- SLA guarantees
- Custom integrations

## 🎨 Branding Guidelines

### Logo Design
- Modern geometric design
- Gradient variations
- Animated logo for loading
- Responsive sizing

### Marketing Materials
- Premium landing page
- Interactive demos
- Video tutorials
- Case studies

## 📚 Documentation

### Developer Docs
- Component library with examples
- API documentation
- Integration guides
- Best practices

### User Guides
- Interactive tutorials
- Video walkthroughs
- FAQ section
- Help center

## 🔄 Continuous Improvement

### Feature Roadmap
- AI-powered form filling
- Blockchain integration
- Advanced ML predictions
- Voice interface
- AR document scanning

### Feedback Loop
- In-app feedback widget
- User interviews
- A/B testing framework
- Analytics-driven decisions

---

This premium setup will create a **world-class loan management system** that not only meets functional requirements but delivers an exceptional user experience that sets new standards in the financial software industry.

## 🔧 Technical Implementation Details

### API Architecture
```typescript
// Premium API structure with proper error handling
export const api = {
  // Loan Applications
  applications: {
    create: async (data: LoanApplication) => {
      return await fetchWithRetry('/api/applications', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: Partial<LoanApplication>) => {
      return await fetchWithRetry(`/api/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    list: async (filters?: ApplicationFilters) => {
      const query = new URLSearchParams(filters);
      return await fetchWithRetry(`/api/applications?${query}`);
    },
    get: async (id: string) => {
      return await fetchWithRetry(`/api/applications/${id}`);
    },
    delete: async (id: string) => {
      return await fetchWithRetry(`/api/applications/${id}`, {
        method: 'DELETE',
      });
    },
    // Real-time subscription
    subscribe: (callback: (data: LoanApplication) => void) => {
      return subscribeToCollection('applications', callback);
    }
  },
  
  // Masters Management
  masters: {
    districts: {
      list: async () => await fetchWithRetry('/api/masters/districts'),
      create: async (data: District) => await fetchWithRetry('/api/masters/districts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      update: async (code: string, data: Partial<District>) => 
        await fetchWithRetry(`/api/masters/districts/${code}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
    },
    talukas: {
      list: async (districtCode?: string) => {
        const query = districtCode ? `?districtCode=${districtCode}` : '';
        return await fetchWithRetry(`/api/masters/talukas${query}`);
      },
    },
    villages: {
      list: async (talukaCode?: string) => {
        const query = talukaCode ? `?talukaCode=${talukaCode}` : '';
        return await fetchWithRetry(`/api/masters/villages${query}`);
      },
      search: async (query: string) => {
        return await fetchWithRetry(`/api/masters/villages/search?q=${query}`);
      },
    },
    // Bulk operations
    bulkImport: async (type: string, data: any[]) => {
      return await fetchWithRetry(`/api/masters/${type}/bulk`, {
        method: 'POST',
        body: JSON.stringify({ data }),
      });
    },
  },
  
  // Analytics
  analytics: {
    dashboard: async () => await fetchWithRetry('/api/analytics/dashboard'),
    reports: {
      generate: async (type: string, filters: any) => {
        return await fetchWithRetry('/api/analytics/reports/generate', {
          method: 'POST',
          body: JSON.stringify({ type, filters }),
        });
      },
      list: async () => await fetchWithRetry('/api/analytics/reports'),
    },
  },
};
```

### State Management Architecture
```typescript
// Zustand store with DevTools integration
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
  // User State
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Application State
  applications: LoanApplication[];
  currentApplication: LoanApplication | null;
  isLoading: boolean;
  
  // Form State
  formData: Partial<LoanApplication>;
  updateFormData: (data: Partial<LoanApplication>) => void;
  resetFormData: () => void;
  
  // UI State
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  notifications: Notification[];
  
  // Actions
  fetchApplications: () => Promise<void>;
  createApplication: (data: LoanApplication) => Promise<void>;
  updateApplication: (id: string, data: Partial<LoanApplication>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        applications: [],
        currentApplication: null,
        isLoading: false,
        formData: {},
        theme: 'dark',
        sidebarOpen: true,
        notifications: [],
        
        // Actions
        setUser: (user) => set({ user }),
        
        updateFormData: (data) => set((state) => ({
          formData: { ...state.formData, ...data }
        })),
        
        resetFormData: () => set({ formData: {} }),
        
        fetchApplications: async () => {
          set({ isLoading: true });
          try {
            const data = await api.applications.list();
            set({ applications: data, isLoading: false });
          } catch (error) {
            set({ isLoading: false });
            get().addNotification({
              type: 'error',
              title: 'Failed to fetch applications',
              message: error.message,
            });
          }
        },
        
        createApplication: async (data) => {
          set({ isLoading: true });
          try {
            const newApp = await api.applications.create(data);
            set((state) => ({
              applications: [...state.applications, newApp],
              isLoading: false,
            }));
            get().addNotification({
              type: 'success',
              title: 'Application created',
              message: 'Your loan application has been submitted successfully.',
            });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },
      }),
      {
        name: 'loan-app-storage',
        partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
      }
    )
  )
);
```

### Performance Optimizations
```typescript
// Image optimization with blur placeholders
import Image from 'next/image';
import { getPlaiceholder } from 'plaiceholder';

export async function getImageWithPlaceholder(src: string) {
  const { base64, img } = await getPlaiceholder(src);
  
  return {
    ...img,
    blurDataURL: base64,
  };
}

// Component with optimized image
export const OptimizedImage = async ({ src, alt, ...props }) => {
  const { blurDataURL } = await getImageWithPlaceholder(src);
  
  return (
    <Image
      src={src}
      alt={alt}
      placeholder="blur"
      blurDataURL={blurDataURL}
      loading="lazy"
      {...props}
    />
  );
};

// Code splitting with dynamic imports
const DynamicChart = dynamic(
  () => import('@/components/charts/AdvancedChart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

// Route prefetching
export const SmartLink = ({ href, children, ...props }) => {
  const router = useRouter();
  
  const prefetch = () => {
    router.prefetch(href);
  };
  
  return (
    <Link 
      href={href} 
      onMouseEnter={prefetch}
      onTouchStart={prefetch}
      {...props}
    >
      {children}
    </Link>
  );
};
```

### Error Handling & Recovery
```typescript
// Global error boundary with recovery
export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to Sentry
    captureException(error, { contexts: { react: errorInfo } });
  }
  
  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };
  
  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          resetError={this.handleReset}
        />
      );
    }
    
    return this.props.children;
  }
}

// Premium error fallback UI
const ErrorFallback = ({ error, resetError }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <GlassCard className="max-w-md p-8 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-red-400" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
      <p className="text-gray-400 mb-6">{error?.message || 'An unexpected error occurred'}</p>
      <div className="flex gap-4 justify-center">
        <button onClick={() => window.history.back()} className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
          Go Back
        </button>
        <GradientButton onClick={resetError}>
          Try Again
        </GradientButton>
      </div>
    </GlassCard>
  </div>
);
```

### Testing Strategy
```typescript
// Component testing with React Testing Library
describe('LoanApplicationForm', () => {
  it('should validate required fields', async () => {
    const { getByLabelText, getByText } = render(<LoanApplicationForm />);
    
    // Submit without filling required fields
    fireEvent.click(getByText('Submit'));
    
    // Check for validation messages
    await waitFor(() => {
      expect(getByText('First name is required')).toBeInTheDocument();
      expect(getByText('Mobile number is required')).toBeInTheDocument();
    });
  });
  
  it('should handle form submission', async () => {
    const onSubmit = jest.fn();
    const { getByLabelText, getByText } = render(
      <LoanApplicationForm onSubmit={onSubmit} />
    );
    
    // Fill form
    fireEvent.change(getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(getByLabelText('Mobile Number'), { target: { value: '9876543210' } });
    
    // Submit
    fireEvent.click(getByText('Submit'));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          mobileNo: '9876543210',
        })
      );
    });
  });
});

// E2E testing with Playwright
test.describe('Loan Application Flow', () => {
  test('should complete full application process', async ({ page }) => {
    await page.goto('/login');
    
    // Login
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to new application
    await page.waitForSelector('[data-testid="dashboard"]');
    await page.click('text=New Application');
    
    // Fill applicant details
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="mobileNo"]', '9876543210');
    
    // Continue through steps
    await page.click('text=Next');
    
    // Verify final submission
    await page.click('text=Submit Application');
    await expect(page.locator('text=Application submitted successfully')).toBeVisible();
  });
});
```

### Accessibility Implementation
```typescript
// Keyboard navigation hook
export const useKeyboardNavigation = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k': // Command palette
            e.preventDefault();
            openCommandPalette();
            break;
          case 's': // Save
            e.preventDefault();
            saveCurrentWork();
            break;
          case '/': // Search
            e.preventDefault();
            focusSearch();
            break;
        }
      }
      
      // Navigation shortcuts
      if (e.altKey) {
        switch (e.key) {
          case '1': navigateTo('/dashboard'); break;
          case '2': navigateTo('/applications'); break;
          case '3': navigateTo('/masters'); break;
          case '4': navigateTo('/analytics'); break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};

// Screen reader announcements
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};

// Focus management
export const FocusTrap = ({ children, active = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!active) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [active]);
  
  return <div ref={containerRef}>{children}</div>;
};
```

### Internationalization (i18n)
```typescript
// Multi-language support setup
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Loan Management System',
      form: {
        firstName: 'First Name',
        lastName: 'Last Name',
        submit: 'Submit Application',
        required: 'This field is required',
      },
      messages: {
        success: 'Application submitted successfully',
        error: 'An error occurred. Please try again.',
      },
    },
  },
  hi: {
    translation: {
      welcome: 'ऋण प्रबंधन प्रणाली में आपका स्वागत है',
      form: {
        firstName: 'पहला नाम',
        lastName: 'अंतिम नाम',
        submit: 'आवेदन जमा करें',
        required: 'यह फ़ील्ड आवश्यक है',
      },
      messages: {
        success: 'आवेदन सफलतापूर्वक सबमिट किया गया',
        error: 'एक त्रुटि हुई। कृपया फिर से प्रयास करें।',
      },
    },
  },
  mr: {
    translation: {
      welcome: 'कर्ज व्यवस्थापन प्रणालीमध्ये आपले स्वागत आहे',
      form: {
        firstName: 'पहिले नाव',
        lastName: 'आडनाव',
        submit: 'अर्ज सबमिट करा',
        required: 'हे फील्ड आवश्यक आहे',
      },
    },
  },
};

const i18n = createInstance();
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

### Security Implementation
```typescript
// Advanced security measures
export const SecurityProvider = ({ children }) => {
  // Content Security Policy
  useEffect(() => {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://firestore.googleapis.com wss://firestore.googleapis.com",
    ].join('; ');
    
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = csp;
    document.head.appendChild(meta);
  }, []);
  
  // XSS Protection
  const sanitizeInput = (input: string) => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
      ALLOWED_ATTR: ['href'],
    });
  };
  
  // Session timeout
  useIdleTimer({
    timeout: 1000 * 60 * 15, // 15 minutes
    onIdle: () => {
      showTimeoutWarning();
    },
    debounce: 500,
  });
  
  return (
    <SecurityContext.Provider value={{ sanitizeInput }}>
      {children}
    </SecurityContext.Provider>
  );
};

// Rate limiting
export const rateLimiter = new Map();

export const checkRateLimit = (userId: string, action: string, limit = 10) => {
  const key = `${userId}:${action}`;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  
  const requests = rateLimiter.get(key) || [];
  const recentRequests = requests.filter((time: number) => now - time < windowMs);
  
  if (recentRequests.length >= limit) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  recentRequests.push(now);
  rateLimiter.set(key, recentRequests);
};
```

## 📱 Mobile App Development (Optional Phase)

### React Native Implementation
```typescript
// Shared components between web and mobile
import { Platform } from 'react-native';
import { View, Text, TouchableOpacity } from 'react-native';

export const Button = ({ onPress, children, variant = 'primary' }) => {
  if (Platform.OS === 'web') {
    return (
      <button onClick={onPress} className={`btn btn-${variant}`}>
        {children}
      </button>
    );
  }
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.button, styles[variant]]}
    >
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

// Native features
import * as LocalAuthentication from 'expo-local-authentication';
import * as DocumentPicker from 'expo-document-picker';
import * as Camera from 'expo-camera';

export const BiometricAuth = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;
  
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to access loan applications',
    disableDeviceFallback: false,
  });
  
  return result.success;
};

export const DocumentScanner = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync();
  if (status !== 'granted') return null;
  
  // Implement document scanning with ML Kit
  return await scanDocument();
};
```

## 🚀 Go-Live Checklist

### Pre-Launch
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed (WCAG AAA)
- [ ] Cross-browser testing completed
- [ ] Load testing performed (1000+ concurrent users)
- [ ] Backup and recovery tested
- [ ] SSL certificates configured
- [ ] CDN configured and tested
- [ ] Monitoring alerts set up
- [ ] Documentation completed
- [ ] Training materials prepared
- [ ] Support team briefed

### Launch Day
- [ ] Database migrations completed
- [ ] Feature flags configured
- [ ] Gradual rollout started (10% → 50% → 100%)
- [ ] Real-time monitoring active
- [ ] Support team on standby
- [ ] Rollback plan ready
- [ ] Communication channels open

### Post-Launch
- [ ] User feedback collected
- [ ] Performance metrics analyzed
- [ ] Bug reports triaged
- [ ] Hot fixes deployed
- [ ] Success metrics tracked
- [ ] Lessons learned documented
- [ ] Next phase planned

---

**The premium loan management system is now ready for implementation. This comprehensive plan ensures a world-class product that delivers exceptional value to users while maintaining the highest standards of quality, security, and performance.**