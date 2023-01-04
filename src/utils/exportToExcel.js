import store from "../store"
import StatusChipsGas from "./statusChipsGas"
import StatusChipsPv from "./statusChipsPv"
import {showSnack} from "../globalActions";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export default class ExportToExcel {
    static exportGasApplications(applications, filename, metaData) {
        //build formatted list for excel export, excel will be exported with these headers
        let formattedData = []
        applications.forEach((a) => {
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
                'Ersatz Heizkessel': a.boiler_replacement_year,
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

        if (formattedData.length === 0) {
            showSnack({message: "Ein leerer Datensatz kann nicht exportiert werden", color: 'red'})
            return
        }

        let metaJson = this.buildMetaData( 'Gewährleistung Biobrennstoffe', metaData)

        this.generateXlsx(formattedData, metaJson, filename)
    }

    static generateXlsx(applicationJson, metaDataJson, filename) {
        /* create a new blank workbook */
        let wb = XLSX.utils.book_new();

        /* create a worksheet for books */
        let wsMeta = XLSX.utils.json_to_sheet(metaDataJson, {skipHeader:true});

        /* Add the worksheet to the workbook */
        XLSX.utils.book_append_sheet(wb, wsMeta, "Fileinfo");

        /* create a worksheet for person details */
        let wsApplicationList = XLSX.utils.json_to_sheet(applicationJson);

        /* Add the worksheet to the workbook */
        XLSX.utils.book_append_sheet(wb, wsApplicationList, "Gesuchliste");

        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data1 = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data1, filename);
    }

    static exportPvApplication(applications, filename, metaData) {
        //build formatted list for excel export, excel will be exported with these headers
        let formattedData = []
        applications.forEach((a) => {
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
                'Abgabe Anteil Gemeinde': a.fee_amount_municipality,
                'Abgabe Anteil Kanton': a.fee_amount_canton,
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

            entry['Abgerechnet'] = a.cleared ? 'Ja' : 'Nein'

            entry['Abrechnungsdatum'] = a.cleared_date ? new Date(a.cleared_date).toLocaleDateString() : ''

            entry['Bemerkung'] = a.remark
            entry['System-ID'] = a.id

            formattedData.push(entry)
        })

        // export to excel only works if variable is called 'data'!

        if (formattedData.length === 0) {
            showSnack({message: "Ein leerer Datensatz kann nicht exportiert werden", color: 'red'})
            return
        }

        let metaJson = this.buildMetaData( 'PV-Ersatzabgabe', metaData)

        this.generateXlsx(formattedData, metaJson, filename)
    }

    static buildMetaData(title, existingMetaInformation) {
        let data = [
            {
                info: 'Export Gesuche',
                value: title
            },
            {
                info: 'Exportdatum',
                value: new Date().toLocaleDateString()
            },
            {
                info: 'Exportzeit',
                value: new Date().toLocaleTimeString()
            }
        ]

        existingMetaInformation.forEach((i) => data.push(i))

        return data
    }

}