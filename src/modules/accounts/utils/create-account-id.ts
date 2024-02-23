export function createAccountId(name: string) {
    return name.toLowerCase().replace(/ /g, '-');
}