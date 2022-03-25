export default function percentage(partial: number, total: number) {
  return `${(partial / total) * 100}%`;
}
