import Geocode from "react-geocode";
import haversine from 'haversine-distance'

export enum addressStatus {
    CLOSE,
    FAR,
    PARTIAL,
    FAIL
}

export default async function validateAddress(shippingInfo: any) {
    Geocode.setApiKey("AIzaSyDgon2s0jMAZr0rvJf7HEIE5ZuASk9Ok2Q");

    try {
        let address = Object.values(shippingInfo).join(' ') + " France"

        const response = await Geocode.fromAddress(address)

        let { lat, lng } = response.results[0].geometry.location;

        const addressParis = { latitude: 48.797390, longitude: 2.329724 }
        const addressBrest = { latitude: 48.390392971380166, longitude: -4.485324374839373 }
        const addressLille = { latitude: 50.634321834200506, longitude: 3.0425540369053823, }
        const addressMontpellier = { latitude: 43.610955728351016, longitude: 3.8644050612397254 }

        const addressArray = [addressParis, addressBrest, addressLille, addressMontpellier]
        const distanceArray = addressArray.map((e) => haversine(e, { latitude: lat, longitude: lng }) / 1000)

        return Math.min(...distanceArray) <= 30 ? addressStatus.CLOSE : addressStatus.FAR;

    }
    catch (error) {
        console.log("No address found.")
        return addressStatus.FAIL
    }

}

