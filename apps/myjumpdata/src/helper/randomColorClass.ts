export const colors: string[] = [
  'bg-red-500/80',
  'bg-orange-500/80',
  'bg-amber-500/80',
  'bg-yellow-500/80',
  'bg-lime-500/80',
  'bg-green-500/80',
  'bg-emerald-500/80',
  'bg-teal-500/80',
  'bg-cyan-500/80',
  'bg-sky-500/80',
  'bg-blue-500/80',
  'bg-indigo-500/80',
  'bg-violet-500/80',
  'bg-purple-500/80',
  'bg-fuchsia-500/80',
  'bg-pink-500/80',
  'bg-rose-500/80',
];
export const randomColorClass = (): string => {
  return colors[Math.floor(Math.random() * colors.length)];
};
export default randomColorClass;
