export default {
    getPVFeeFormatted(area) {
        let fee = 0;
        if (area >= 3000) {
            fee = 81000
        } else {
            fee = (area / 100 * 2700).toFixed()
        }
        return numberWithDelimiter(fee)
    },
    getPVFeeAsFloat(area) {
        let fee = 0;
        if (area >= 3000) {
            fee = 81000
        } else {
            fee = (area / 100 * 2700)
        }

        return fee.toFixed(0)
    },

}

function numberWithDelimiter(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

