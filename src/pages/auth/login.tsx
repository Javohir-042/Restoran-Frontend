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

export const Login = () => {
  const { data: generalData } = useGeneralSettings();
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
    <div className="min-h-screen flex">
      <div
        className="hidden md:flex w-1/2 bg-blue-600 relative overflow-hidden flex-col items-center justify-center text-white p-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div className="w-28 h-28 bg-white rounded-xl flex flex-col items-center justify-center mb-6 px-2 text-center text-clip overflow-hidden shadow-lg border border-blue-100">
          <span className="text-blue-600 text-[2rem] drop-shadow-sm">🍽️</span>
          <span className="text-blue-600 font-extrabold text-[11px] leading-tight mt-1.5 uppercase tracking-wide break-words w-full h-8 flex items-center justify-center">
            {generalData?.restaurantName || "RESTORAN"}
          </span>
        </div>
        <h1 className="text-[34px] font-black mb-3 tracking-tight text-white drop-shadow-md">
          {generalData?.restaurantName || "RESTORAN"}
        </h1>
        <p className="text-center text-blue-100 max-w-xs text-sm">
          Buyurtmalar, xodimlar va stollarni bitta joydan boshqaring.
        </p>
        <div className="absolute bottom-6 left-8 right-8 flex justify-between text-[11px] text-blue-200">
          <span>SYSTEM v1.0.0</span>
          <span>SECURE TERMINAL ACCESS</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-center text-gray-900">
            Welcome Back
          </h2>
          <p className="text-xs text-center text-gray-500 mt-1 mb-6">
            Please select your login method
          </p>

          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => {
                setTab("admin");
                setTwoFaAdminId(null);
                setOtpCode("");
              }}
              className={`flex-1 pb-2 text-sm font-medium transition-colors ${tab === "admin"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400"
                }`}
            >
              Admin
            </button>
            <button
              onClick={() => setTab("staff")}
              className={`flex-1 pb-2 text-sm font-medium transition-colors ${tab === "staff"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400"
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
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Ikki bosqichli tasdiqlash
                  </h3>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Telefoningizga yuborilgan kodni kiriting
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
                    className="w-full text-center tracking-[0.5em] px-3 py-3 border border-gray-200 rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={onVerify2Fa}
                  disabled={verify2Fa.isPending || otpCode.length < 4}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {verify2Fa.isPending ? "Tekshirilmoqda..." : "TASDIQLASH"}
                </button>

                <button
                  onClick={() => {
                    setTwoFaAdminId(null);
                    setOtpCode("");
                  }}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Orqaga qaytish
                </button>
              </div>
            ) : (
              /* ─── Admin Login Form ─── */
              <form
                onSubmit={form.handleSubmit(onAdminSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Telefon raqami
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...form.register("phoneNumber")}
                      placeholder="+998901234567"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                  {form.formState.errors.phoneNumber && (
                    <p className="text-xs text-red-500 mt-1">
                      {form.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Parol
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...form.register("password")}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                  {adminLogin.isPending ? "Kirilmoqda..." : "LOGIN TO DASHBOARD"}
                </button>
              </form>
            )
          ) : (
            <div>
              <div className="flex justify-center gap-3 mb-6">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full border-2 ${i < pin.length
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-300"
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
                    className="h-12 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                  >
                    {d}
                  </button>
                ))}
                <button
                  onClick={handleBackspace}
                  className="h-12 rounded-lg bg-red-50 border border-red-100 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                >
                  <Delete size={16} />
                </button>
                <button
                  onClick={() => handlePinPress("0")}
                  disabled={staffLogin.isPending}
                  className="h-12 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                  0
                </button>
                <div className="h-12 rounded-lg bg-green-50 border border-green-100 text-green-600 flex items-center justify-center">
                  <Check size={16} />
                </div>
              </div>

              <p className="text-center text-xs text-gray-500 mt-4">
                Enter your 4-digit employee PIN to clock in.
              </p>
            </div>
          )}

          {generalData?.contactPhone && (
            <div className="mt-8 text-center border-t border-gray-100 pt-5">
              <p className="text-xs text-gray-400 font-medium">Texnik yordam va savollar uchun:</p>
              <p className="text-sm font-bold text-gray-600 mt-0.5">{generalData.contactPhone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
