const excel = require('excel4node');

module.exports = class FileExport {
	constructor() {
		// this.accountRep = rep;
	}

	getExcelFile(data) {
		let workbook = new excel.Workbook();
		
		let worksheet = workbook.addWorksheet('Sheet 1');
		let myStyle = workbook.createStyle({
			font: {
				bold: true
			}, 
			alignment: {
				wrapText: true,
				horizontal: 'center',
				vertical: 'center'
			}
		});
		let wrap = workbook.createStyle({
			font: {
				size: 12
			},
			alignment: {
				wrapText: true
			}
		});

		let row = 1;
		for(let i = 0; i < data.length; i++) {

			let current = data[i];
			// console.log(current.name)
			worksheet.cell(row, 1).string('Brand').style(myStyle);
			worksheet.cell(row, 2).string(`${current.name}`);

			row++;
			
			let descr = stripHtmlTags(current.description);

			worksheet.row(row).setHeight(120);
			worksheet.cell(row, 1).string('Description').style(myStyle);
			worksheet.cell(row, 2, row, 8, true).string(`${descr}`).style(wrap);

			row += 2;

			worksheet.cell(row, 1).string('Code').style(myStyle);
			worksheet.cell(row, 2).string('Name').style(myStyle);
			worksheet.cell(row, 3).string('Length').style(myStyle);
			worksheet.cell(row, 4).string('Ring').style(myStyle);
			worksheet.cell(row, 5).string('Shade').style(myStyle);
			worksheet.cell(row, 6).string('Quantity').style(myStyle);
			worksheet.cell(row, 7).string('MSRP').style(myStyle);
			worksheet.cell(row, 8).string('Jrprice').style(myStyle);
			row++;

			current.items.forEach(function(element) {
				worksheet.cell(row, 1).string(`${element.code}`);
				worksheet.cell(row, 2).string(`${element.name}`);
				worksheet.cell(row, 3).string(`${element.length}`);
				worksheet.cell(row, 4).string(`${element.ring}`);
				worksheet.cell(row, 5).string(`${element.shade}`);
				worksheet.cell(row, 6).string(`${element.quantity}`);
				worksheet.cell(row, 7).string(`${element.msrp}`);
				worksheet.cell(row, 8).string(`${element.jr_price}`);
				row++;
			}, this);

			row += 2;
		}

		return workbook;
	}
};

function stripHtmlTags(str) {
	if ((str===null) || (str==='')) return false;
	else str = str.toString();
	return str.replace(/<[^>]*>/g, '');
}