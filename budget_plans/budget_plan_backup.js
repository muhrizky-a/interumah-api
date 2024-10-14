// playground requires you to assign document definition to a variable called dd
const metadata = {
    info: {
        title: 'DAPUR 3x3',
        author: 'PT. ABC DESIGN',
    },
    content: {
        "persiapan": {
            "data": [
                {
                    "uraian": "pembersihan lapangan",
                    "volume": 124.2,
                    "satuan": "M",
                    "harga": 3871.88,
                    "total": 480886.88,
                },
                {
                    "uraian": "Pasangan Bouwplank / Pengukuran",
                    "volume": 26.4,
                    "satuan": "M",
                    "harga": 19470.5,
                    "total": 514021.2,
                },
                {
                    "uraian": "Biaya Air Kerja",
                    "volume": 1,
                    "satuan": "M",
                    "harga": 150000,
                    "total": 150000,
                },
            ],
            "total": 1144908
        },
        "pondasi": {
            "data": [
                {
                    "uraian": "pembersihan lapangan",
                    "volume": 124.2,
                    "satuan": "M",
                    "harga": 3871.88,
                    "total": 480886.88,
                },
                {
                    "uraian": "Pasangan Bouwplank / Pengukuran",
                    "volume": 26.4,
                    "satuan": "M",
                    "harga": 19470.5,
                    "total": 514021.2,
                },
                {
                    "uraian": "Biaya Air Kerja",
                    "volume": 12,
                    "satuan": "M",
                    "harga": 150000,
                    "total": 150000,
                },
            ],
            "total": 1144908
        }
    }
    // "total": 999999999
}

let budgetPlans = [];
Object.keys(metadata.content).forEach((key, index) => {
    let value = metadata.content[key];

    metadata.total = 0;
    metadata.total += metadata.content[key].total;
    metadata.total = parseFloat(metadata.total.toFixed(2));

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


var dd = {
    info: {
        title: 'awesome Document',
        author: 'john doe',
        subject: 'subject of document',
        keywords: 'keywords for document',
    },
    content: [
        { text: 'PT. ABC DESIGN', style: 'subheader', margin: [0, 0, 0, 20] },
        { text: 'RENCANA ANGGARAN BIAYA AWAL', style: 'subheader_center' },
        { text: 'INTERIOR DAPUR 3x3', style: 'subheader_center' },

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
                    [
                        { text: 'I.', bold: true },
                        { text: 'PERSIAPAN', bold: true },
                        {}, {}, {}, {}
                    ],
                    [
                        { text: '1.', alignment: 'right' },
                        'Pembersihan X, Pembersihan Y, Pembersihan Z',
                        { text: '124,200', alignment: 'right' },
                        { text: 'M²', bold: true, alignment: 'center' },
                        { text: '3.871,88', alignment: 'right' },
                        { text: '480.868,88', alignment: 'right' },
                    ],
                    [
                        { text: '2.', alignment: 'right' },
                        'Pembersihan X',
                        { text: '124,200', alignment: 'right' },
                        { text: 'M²', bold: true, alignment: 'center' },
                        { text: '3.871,88', alignment: 'right' },
                        { text: '480.868,88', alignment: 'right' },
                    ],
                    [
                        { text: '3.', alignment: 'right' },
                        'Pembersihan X',
                        { text: '124,200', alignment: 'right' },
                        { text: 'M²', bold: true, alignment: 'center' },
                        { text: '3.871,88', alignment: 'right' },
                        { text: '480.868,88', alignment: 'right' },
                    ],
                    [
                        {}, {}, {}, {}, {},
                        { text: '1.144.908,08', bold: true, alignment: 'right' },
                    ],
                    [{}, {}, {}, {}, {}, '`'],
                    [
                        { text: 'II.', bold: true },
                        { text: 'PONDASI', bold: true },
                        {}, {}, {}, {}
                    ],
                    [
                        { text: '1.', alignment: 'right' },
                        'Pembersihan X',
                        { text: '124,200', alignment: 'right' },
                        { text: 'M²', bold: true, alignment: 'center' },
                        { text: '3.871,88', alignment: 'right' },
                        { text: '480.868,88', alignment: 'right' },
                    ],
                    [
                        { text: '2.', alignment: 'right' },
                        'Pembersihan X',
                        { text: '124,200', alignment: 'right' },
                        { text: 'M²', bold: true, alignment: 'center' },
                        { text: '3.871,88', alignment: 'right' },
                        { text: '480.868,88', alignment: 'right' },
                    ],
                    [
                        { text: '3.', alignment: 'right' },
                        'Pembersihan X',
                        { text: '124,200', alignment: 'right' },
                        { text: 'M²', bold: true, alignment: 'center' },
                        { text: '3.871,88', alignment: 'right' },
                        { text: '480.868,88', alignment: 'right' },
                    ],
                    [
                        {}, {}, {}, {}, {},
                        { text: '1.144.908,08', bold: true, alignment: 'right' },
                    ],
                    [{}, {}, {}, {}, {}, '`'],
                    [
                        { text: 'Total (Sementara)', bold: true, alignment: 'center', colSpan: 5 },
                        {}, {}, {}, {},
                        { text: '9.999.999.999.999', bold: true, alignment: 'right' },
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

var ddModified = {
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
                        {}, {}, {}, {}, {},
                        { text: '1.144.908,08', bold: true, alignment: 'right' },
                    ],
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

module.exports = {
    dd,
    ddModified,
    metadata
};