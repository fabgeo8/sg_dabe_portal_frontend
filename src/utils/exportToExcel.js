import {json2excel} from "js2excel"
import store from "../store"
import StatusChipsGas from "./statusChipsGas"
import StatusChipsPv from "./statusChipsPv"

export default class ExportToExcel {
    static exportGasApplications(applicationIds, filename) {
        let dataToExport = []

        // push all matching applications to list
        let applicationList = store.getters.getGasApplications

        applicationList.forEach((a) => {
            if (applicationIds.includes(a.id)) {
                dataToExport.push(a)
            }
        })

        //build formatted list for excel export, excel will be exported with these headers
        let formattedData = []
        dataToExport.forEach((a) => {
            let entry = {
                'Gesuch-ID': a.identifier,
                'Status': StatusChipsGas[a.status].text,
                'Statusänderung': new Date(a.last_status_date).toLocaleDateString(),
                'Variante': a.version,
                'EGID': a.object_egid,
                'Parzelle': a.object_plot,
                'Strasse': a.object_street,
                'Hausnummer': a.object_streetnumber,
                'PLZ': a.object_zip,
                'Ort': a.object_city,
                'EBF': a.generator_area,
                'Gasversorger': a.gas_operator,
                'Art des Brennstoff': a.fuel_type,
                'Baujahr': a.year_of_construction,
                'Datum Ersatz Heizkessel': a.boiler_replacement_year,
                'Gemeinde': a.Municipality.name
            }

            // add status change dates
            for (const s in StatusChipsGas) {
                if (a.status_changed_dates[s]) {
                    entry['Datum ' + StatusChipsGas[s].text] = new Date(a.status_changed_dates[s]).toLocaleDateString()
                } else {
                    entry['Datum ' + StatusChipsGas[s].text] = ''
                }
            }

            entry['Bemerkung'] = a.remark
            entry['System-ID'] = a.id

            formattedData.push(entry)
        })

        // export to excel only works if variable is called 'data'!
        const data = formattedData

        try {
            json2excel({
                data,
                name: filename,
                formateDate: 'yyyy.mm.dd'
            });
        } catch (e) {
            console.error('export error', e);
        }
    }

    static exportPvApplication(applicationIds, filename) {
        let dataToExport = []

        // push all matching applications to list
        let applicationList = store.getters.getPvApplications

        applicationList.forEach((a) => {
            if (applicationIds.includes(a.id)) {
                dataToExport.push(a)
            }
        })

        //build formatted list for excel export, excel will be exported with these headers
        let formattedData = []
        dataToExport.forEach((a) => {
            let entry = {
                'Gesuch-ID': a.identifier,
                'Status': StatusChipsPv[a.status].text,
                'Statusänderung': new Date(a.last_status_date).toLocaleDateString(),
                'Variante': a.version,
                'EGID': a.object_egid,
                'Parzelle': a.object_plot,
                'Strasse': a.object_street,
                'Hausnummer': a.object_streetnumber,
                'PLZ': a.object_zip,
                'Ort': a.object_city,
                'EBF': a.generator_area,
                'Abgabe': a.fee,
                'Gemeinde': a.Municipality.name
            }

            // add status change dates
            for (const s in StatusChipsPv) {
                if (a.status_changed_dates[s]) {
                    entry['Datum ' + StatusChipsPv[s].text] = new Date(a.status_changed_dates[s]).toLocaleDateString()
                } else {
                    entry['Datum ' + StatusChipsPv[s].text] = ''
                }
            }

            entry['Bemerkung'] = a.remark
            entry['System-ID'] = a.id

            formattedData.push(entry)
        })

        // export to excel only works if variable is called 'data'!
        const data = formattedData

        try {
            json2excel({
                data,
                name: filename,
                formateDate: 'yyyy.mm.dd'
            });
        } catch (e) {
            console.error('export error', e);
        }
    }
}