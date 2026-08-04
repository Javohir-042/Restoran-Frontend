import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Delete, Check, ShieldCheck, Eye, EyeOff } from "lucide-react";
import {
  adminLoginSchema,
  type AdminLoginFormValues,
} from "@/features/auth/admin-login/schema";
import { useAdminLogin } from "@/features/auth/admin-login/useAdminLogin";
import { useStaffLogin } from "@/features/auth/staff-login/useStaffLogin";
import { useVerify2Fa } from "@/features/auth/admin-login/useVerify2Fa";
import { useGeneralSettings } from "@/features/settings/useSettings";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export const Login = () => {
  const { data: generalData } = useGeneralSettings();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState<"admin" | "staff">("admin");
  const [pin, setPin] = useState("");
  const [twoFaAdminId, setTwoFaAdminId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const adminLogin = useAdminLogin();
  const staffLogin = useStaffLogin();
  const verify2Fa = useVerify2Fa();

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { phoneNumber: "", password: "" },
  });

  const onAdminSubmit = (data: AdminLoginFormValues) => {
    adminLogin.mutate(
      { phoneNumber: data.phoneNumber!, password: data.password! },
      {
        onSuccess: (res) => {
          if (res.data.requires2FA && res.data.adminId) {
            setTwoFaAdminId(res.data.adminId);
          }
        },
      },
    );
  };

  const onVerify2Fa = () => {
    if (!twoFaAdminId || otpCode.length < 4) return;
    verify2Fa.mutate({ adminId: twoFaAdminId, otp: otpCode });
  };

  const handlePinPress = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin.length === 4) {
      staffLogin.mutate({ pinCode: newPin }, { onError: () => setPin("") });
    }
  };

  const handleBackspace = () => setPin((p) => p.slice(0, -1));

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#09090b] transition-colors duration-200">
      <div className="hidden md:flex w-1/2 relative overflow-hidden flex-col items-center justify-center border-r border-transparent dark:border-[#27272a] p-10 transition-colors duration-200">

        {/* Background Layer */}
        <div className="absolute inset-0 bg-blue-600 dark:bg-[#050508] transition-colors duration-200 z-0" />

        {/* Subtle Dark Mode Glow effect */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] hidden dark:block z-0 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] hidden dark:block z-0 pointer-events-none" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 z-0 opacity-100 dark:opacity-30 transition-opacity duration-200 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glassmorphism Logo Box */}
        <div className="relative z-10 w-32 h-32 bg-white dark:bg-white/[0.03] rounded-2xl flex flex-col items-center justify-center mb-8 px-2 text-center text-clip overflow-hidden shadow-[0_8px_30px_rgba(37,99,235,0.2)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-blue-100 dark:border-white/10 dark:backdrop-blur-3xl transition-all">
          <span className="text-blue-600 dark:text-blue-400 text-[2.5rem] drop-shadow-sm mb-1">🍽️</span>
          <span className="text-blue-600 dark:text-blue-300 font-extrabold text-[12px] leading-tight mt-1 uppercase tracking-widest break-words w-full flex items-center justify-center">
            {generalData?.restaurantName || "RESTORAN"}
          </span>
        </div>

        {/* Restaurant Name */}
        <h1 className="relative z-10 text-[38px] font-black mb-4 tracking-tight drop-shadow-md text-white dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-white/60">
          {generalData?.restaurantName || "RESTORAN"}
        </h1>

        <p className="relative z-10 text-center text-blue-100 dark:text-[#a1a1aa] max-w-sm text-[15px] font-medium leading-relaxed transition-colors">
          {t("Buyurtmalar, xodimlar va stollarni bitta joydan boshqaring.")}
        </p>

        <div className="absolute bottom-10 left-12 right-12 z-10 flex justify-between text-[11px] font-semibold tracking-wider text-blue-200 dark:text-[#52525b] transition-colors uppercase">
          <span>SYSTEM v1.0.0</span>
          <span>SECURE TERMINAL ACCESS</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative items-center justify-center p-6">
        {/* Settings Toggle */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-1.5 text-gray-500 dark:text-[#a1a1aa] hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-lg transition-colors border border-transparent dark:border-[#27272a]"
            title="Toggle Dark Mode"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <div className="flex items-center bg-white dark:bg-[#27272a] p-0.5 rounded-lg border border-gray-200/60 dark:border-[#27272a] shadow-sm transition-colors">
            <button
              onClick={() => setLanguage("uz")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all sm:px-3 ${language === "uz"
                ? "bg-blue-50 dark:bg-[#3f3f46] text-blue-600 dark:text-[#fafafa] shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                : "text-gray-500 dark:text-[#a1a1aa] hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              UZB
            </button>
            <button
              onClick={() => setLanguage("ru")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all sm:px-3 ${language === "ru"
                ? "bg-blue-50 dark:bg-[#3f3f46] text-blue-600 dark:text-[#fafafa] shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                : "text-gray-500 dark:text-[#a1a1aa] hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              RUS
            </button>
          </div>
        </div>

        <div className="w-full max-w-sm bg-white dark:bg-[#18181b] rounded-2xl shadow-sm border border-gray-100 dark:border-[#27272a] p-8 transition-colors">
          <h2 className="text-xl font-bold text-center text-gray-900 dark:text-[#fafafa]">
            {t("Welcome Back")}
          </h2>
          <p className="text-xs text-center text-gray-500 dark:text-[#a1a1aa] mt-1 mb-6">
            {t("Please select your login method")}
          </p>

          <div className="flex border-b border-gray-200 dark:border-[#27272a] mb-6">
            <button
              onClick={() => {
                setTab("admin");
                setTwoFaAdminId(null);
                setOtpCode("");
              }}
              className={`flex-1 pb-2 text-sm font-medium transition-colors ${tab === "admin"
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "text-gray-400 dark:text-[#71717a]"
                }`}
            >
              Admin
            </button>
            <button
              onClick={() => setTab("staff")}
              className={`flex-1 pb-2 text-sm font-medium transition-colors ${tab === "staff"
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "text-gray-400 dark:text-[#71717a]"
                }`}
            >
              Staff
            </button>
          </div>

          {tab === "admin" ? (
            twoFaAdminId ? (
              /* ─── 2FA OTP Verification ─── */
              <div className="space-y-4">
                <div className="flex flex-col items-center mb-2">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3 transition-colors">
                    <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa]">
                    {t("Ikki bosqichli tasdiqlash")}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-[#a1a1aa] text-center mt-1">
                    {t("Telefoningizga yuborilgan kodni kiriting")}
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) =>
                      setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    className="w-full text-center tracking-[0.5em] px-3 py-3 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#18181b] dark:text-[#fafafa] rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
                  />
                </div>

                <button
                  onClick={onVerify2Fa}
                  disabled={verify2Fa.isPending || otpCode.length < 4}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {verify2Fa.isPending ? t("Tekshirilmoqda...") : t("TASDIQLASH")}
                </button>

                <button
                  onClick={() => {
                    setTwoFaAdminId(null);
                    setOtpCode("");
                  }}
                  className="w-full text-sm text-gray-500 dark:text-[#a1a1aa] hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {t("← Orqaga qaytish")}
                </button>
              </div>
            ) : (
              /* ─── Admin Login Form ─── */
              <form
                onSubmit={form.handleSubmit(onAdminSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-[#a1a1aa]">
                    {t("Telefon raqami")}
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#71717a]" />
                    <input
                      {...form.register("phoneNumber")}
                      placeholder="+998901234567"
                      className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] rounded-lg text-sm text-gray-900 dark:text-[#fafafa] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  {form.formState.errors.phoneNumber && (
                    <p className="text-xs text-red-500 mt-1">
                      {form.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-[#a1a1aa]">
                    {t("Parol")}
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#71717a]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...form.register("password")}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] rounded-lg text-sm text-gray-900 dark:text-[#fafafa] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-[#fafafa] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={adminLogin.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {adminLogin.isPending ? t("Kirilmoqda...") : t("LOGIN TO DASHBOARD")}
                </button>
              </form>
            )
          ) : (
            <div>
              <div className="flex justify-center gap-3 mb-6">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full border-2 transition-colors ${i < pin.length
                      ? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                      : "border-gray-300 dark:border-[#3f3f46]"
                      }`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                  <button
                    key={d}
                    onClick={() => handlePinPress(d)}
                    disabled={staffLogin.isPending}
                    className="h-12 rounded-lg bg-gray-50 dark:bg-[#27272a] border border-gray-200 dark:border-[#3f3f46] text-gray-700 dark:text-[#fafafa] font-medium hover:bg-gray-100 dark:hover:bg-[#3f3f46] transition-colors"
                  >
                    {d}
                  </button>
                ))}
                <button
                  onClick={handleBackspace}
                  className="h-12 rounded-lg bg-red-50 dark:bg-rose-950/30 border border-red-100 dark:border-rose-900/50 text-red-500 dark:text-rose-400 flex items-center justify-center hover:bg-red-100 dark:hover:bg-rose-900/50 transition-colors"
                >
                  <Delete size={16} />
                </button>
                <button
                  onClick={() => handlePinPress("0")}
                  disabled={staffLogin.isPending}
                  className="h-12 rounded-lg bg-gray-50 dark:bg-[#27272a] border border-gray-200 dark:border-[#3f3f46] text-gray-700 dark:text-[#fafafa] font-medium hover:bg-gray-100 dark:hover:bg-[#3f3f46] transition-colors"
                >
                  0
                </button>
                <div className="h-12 rounded-lg bg-green-50 dark:bg-emerald-950/30 border border-green-100 dark:border-emerald-900/50 text-green-600 dark:text-emerald-400 flex items-center justify-center transition-colors">
                  <Check size={16} />
                </div>
              </div>

              <p className="text-center text-xs text-gray-500 dark:text-[#a1a1aa] mt-4">
                {t("Enter your 4-digit employee PIN to clock in.")}
              </p>
            </div>
          )}

          {generalData?.contactPhone && (
            <div className="mt-8 text-center border-t border-gray-100 dark:border-[#27272a] pt-5 transition-colors">
              <p className="text-xs text-gray-400 dark:text-[#71717a] font-medium">{t("Texnik yordam va savollar uchun:")}</p>
              <p className="text-sm font-bold text-gray-600 dark:text-[#a1a1aa] mt-0.5">{generalData.contactPhone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
