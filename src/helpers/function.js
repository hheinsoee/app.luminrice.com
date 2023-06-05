export function remove(array, remove) {
    const index = array.indexOf(remove)
    if (index > -1) {
        array.splice(index, 1)
    }
    return array;
}
export function nFormat(num) {
    return (num).toLocaleString(undefined, { minimumFractionDigits: 0 });
}