// playground requires you to assign document definition to a variable called dd
const metadata = (content, info) => {
    return {
        info: {
            title: info.title,
            author: info.author,
        },
        content
    }
}

var dd = (metadata) => {
    let budgetPlans = [];
    metadata.total = 0;

    Object.keys(metadata.content).forEach((key, index) => {
        let value = metadata.content[key];

        metadata.total += metadata.content[key].total;

        let details = [];
        Object.keys(value).forEach(k => {
            if (k == 'data') {
                value[k].forEach((l, i) => {
                    details.push(
                        [
                            { text: `${i + 1}`, alignment: 'right' },
                            l.uraian,
                            { text: l.volume, alignment: 'right' },
                            { text: l.satuan, bold: true, alignment: 'center' },
                            { text: l.harga, alignment: 'right' },
                            { text: l.total, alignment: 'right' },
                        ]
                    );
                });
            }
        });

        budgetPlans.push(
            [
                { text: `${index + 1}.`, bold: true },
                { text: key.toUpperCase(), bold: true },
                {}, {}, {}, {}
            ]
        );
        budgetPlans = budgetPlans.concat(details);
        budgetPlans.push([
            {}, {}, {}, {}, {}, '`'
        ]);
    });
    metadata.total = parseFloat(metadata.total.toFixed(2));

    return {
        content: [
            { text: metadata.info.author, style: 'subheader', margin: [0, 0, 0, 20] },
            { text: 'RENCANA ANGGARAN BIAYA', style: 'subheader_center' },
            { text: 'INTERIOR ' + metadata.info.title, style: 'subheader_center' },

            {
                style: 'tableExample',
                table: {
                    widths: [20, 300, 75, 30, '*', '*'],
                    body: [
                        [
                            { text: 'NO.', bold: true, alignment: 'center', rowSpan: 2 },
                            { text: 'URAIAN PEKERJAAN', bold: true, alignment: 'center', rowSpan: 2 },
                            { text: 'VOLUME', bold: true, alignment: 'center', rowSpan: 2 },
                            { text: 'SAT', bold: true, alignment: 'center', rowSpan: 2 },
                            { text: 'HARGA', bold: true, alignment: 'center' },
                            { text: 'JUMLAH', bold: true, alignment: 'center' },
                        ],
                        [
                            {}, {}, {}, {},
                            { text: 'SATUAN (Rp)', bold: true, alignment: 'center' },
                            { text: '(Rp)', bold: true, alignment: 'center' },
                        ],
                        ...budgetPlans,
                        [
                            { text: 'Total (Sementara)', bold: true, alignment: 'center', colSpan: 5 },
                            {}, {}, {}, {},
                            { text: metadata.total, bold: true, alignment: 'right' },
                        ],

                    ]
                }
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            },
            center: {
                alignment: 'center'
            },
            subheader_center: {
                fontSize: 16,
                bold: true,
                margin: [0, 0, 0, 5],
                alignment: 'center'
            }
        },
        defaultStyle: {
            // alignment: 'justify'
        },
        pageSize: 'A4',
        pageOrientation: 'landscape'
    }
}

module.exports = {
    dd,
    metadata
};