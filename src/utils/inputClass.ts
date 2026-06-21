export function inputClass(hasError?: boolean) {
  return `
    w-full px-3 py-2 border rounded-lg text-sm
    focus:outline-none focus:ring-2 transition-colors
    ${
      hasError
        ? 'border-red-400 focus:ring-red-300'
        : 'border-slate-200 focus:ring-blue-500'
    }
  `;
}