export function getGridClass(ratio: string) {
    const map: Record<string, string> = {
        '50-50': 'lg:grid-cols-2',
        '40-60': 'lg:grid-cols-[4fr_6fr]',
        '60-40': 'lg:grid-cols-[6fr_4fr]',
    };
    return map[ratio] || 'lg:grid-cols-2';
}
