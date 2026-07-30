function getStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Muy débil", color: "bg-red-500" };
  if (score === 2) return { score: 2, label: "Débil", color: "bg-orange-400" };
  if (score === 3) return { score: 3, label: "Regular", color: "bg-yellow-400" };
  if (score === 4) return { score: 4, label: "Fuerte", color: "bg-emerald-400" };
  return { score: 5, label: "Muy fuerte", color: "bg-emerald-600" };
}

export function PasswordStrength({ password }: { password: string }) {
  const { score, label, color } = getStrength(password);

  return (
    <div className="space-y-1 mt-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= score ? color : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${color.replace("bg-", "text-")}`}>{label}</p>
    </div>
  );
}