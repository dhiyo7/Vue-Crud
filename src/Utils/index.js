import dayjs from "dayjs";
import id from "dayjs/locale/id"

dayjs.locale(id)

export const dateFormat = (date, format) => {
    return dayjs(date).format(format)
}

export const formatRupiah = (money) => {
    return new Intl.NumberFormat('id-ID',
        {style: 'currency', currency: 'IDR', minimumFractionDigits: 0}
    ).format(money);
}
