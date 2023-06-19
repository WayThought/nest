export function isNotEmptyString(str: string): boolean {
    if (typeof str == 'string' && str.length > 0) {
        return true
    } else {
        return false
    }
}