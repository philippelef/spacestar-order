import { ErrorEnum } from "../pages/checkout"

function ValidateEmail(input) {
    var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return input.match(validRegex)
}

function ValidatePhone(input: string) {
    input = input.replaceAll(/\s+/g, '')
    var validRegex = /^((?:\+|00)[17](?:|\-)?|(?:\+|00)[1-9]\d{0,2}(?:|\-)?|(?:\+|00)1\-\d{3}(?:|\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?:|\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?:|\-)[0-9]{3}(?:|\-)[0-9]{4})|([0-9]{7}))$/;
    return input.match(validRegex)
}

function ValidatePostalCode(input) {
    var validRegex = /^\d{5}/;
    return input.match(validRegex)
}

function ValidateSpecial(customerInfo, shippingInfo) {
    var validRegex = /^\s*$/
    if (customerInfo.firstName.match(validRegex))
        return false
    if (customerInfo.lastName.match(validRegex))
        return false
    if (shippingInfo.address.match(validRegex))
        return false
    return true
}

export function CheckRegex(customerInfo, shippingInfo, setErrorStatus) {
    if (!ValidateSpecial(customerInfo, shippingInfo)) {
        setErrorStatus(ErrorEnum.EMPTYFIELD)
        return false
    }

    if (!ValidateEmail(customerInfo.email)) {
        setErrorStatus(ErrorEnum.WRONGMAIL)
        return false
    }


    if (!ValidatePostalCode(shippingInfo.postalCode)) {
        setErrorStatus(ErrorEnum.WRONGPOSTAL)
        return false
    }

    if (!ValidatePhone(customerInfo.phone)) {
        setErrorStatus(ErrorEnum.WRONGPHONE)
        return false
    }

    return true
}