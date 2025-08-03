
import fs from 'fs'
import PDFDocument from 'pdfkit-table'

export function onCreatePdf(data) {
    return new Promise((resolve, reject) => {
        let doc = new PDFDocument({ margin: 15, size: 'A4' })
        const stream = fs.createWriteStream('./bugs.pdf')
        doc.pipe(stream)

        _createPdf(doc, data)
            .then(() => doc.end())
            .catch(reject)

        stream.on('finish', () => resolve())
        stream.on('error', reject)
    })
}

function _createPdf(doc, data) {
    const bugsSorted = data.sort((a, b) => a.createdAt - b.createdAt)
    const bugsReadyForPDF = bugsSorted.map(bug => {
        const { title, severity, description, _id, createdAt } = bug
        return [title, severity, description, _id, new Date(createdAt).toLocaleString()]
    })

    const table = {
        title: 'Bugs List',
        subtitle: 'Sorted by time of creation',
        headers: ['title', 'severity', 'description', 'id', 'createdAt'],
        rows: [...bugsReadyForPDF]
    }

    return doc.table(table, {
        columnsSize: [110, 60, 180, 100, 110],
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
        x: doc.page.margins.left
    })
}
