export function rgbaToHexString(rgba:Uint8ClampedArray):string{
    return numberToHexFixSize(rgba[0],2)+numberToHexFixSize(rgba[1],2)+numberToHexFixSize(rgba[2],2);
}
function numberToHexFixSize(value:number,size:number):string{
    return ('0'.repeat(size) + value.toString(16).toUpperCase()).slice(-size)
}


