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

		// let start = new Date();
		// let now = new Date();
		for(let i = 0; i < data.length; i++) {
			// console.log(i, now - start);
			// start = new Date();

			let current = data[i];
			// console.log(current.name)
			worksheet.cell(row, 1).string('Brand').style(myStyle);
			worksheet.cell(row, 2).string(`${current.name}`);

			row++;
			
			let descr = stripHtmlTags(current.description);

			worksheet.row(row).setHeight(120);
			worksheet.cell(row, 1).string('Description').style(myStyle);
			worksheet.cell(row, 2, row, 11, true).string(`${descr}`).style(wrap);

			row += 2;

			worksheet.row(row).setHeight(30);
			worksheet.cell(row, 1).string('Code').style(myStyle);
			// worksheet.cell(row, 2, row, 5, true).string('').style(myStyle);
			
			worksheet.cell(row, 6).string('Quantity').style(myStyle);
			worksheet.cell(row, 7).string('MSRP').style(myStyle);
			worksheet.cell(row, 8).string('Jrprice').style(myStyle);
			worksheet.cell(row, 9).string('5 pack Price').style(myStyle);
			worksheet.cell(row, 10).string('Sale Price').style(myStyle);
			worksheet.cell(row, 11).string('Future Price').style(myStyle);
			worksheet.cell(row, 12).string('Wholesale Price').style(myStyle);
			worksheet.cell(row, 13).string('Seriouscigars Price').style(myStyle);
			worksheet.cell(row, 14).string('Cigars Price').style(myStyle);
			row++;

			current.items.forEach(function(element) {
				let msrp = element.msrp == -1 ? "" : `$${element.msrp.toFixed(2)}`;
				let jrPrice = element.jr_price == -1 ? "" : `$${element.jr_price.toFixed(2)}`;
				let fivePackPrice = element.five_pack_price == -1 ? "" : `$${element.five_pack_price.toFixed(2)}`;

				worksheet.cell(row, 1).string(`${element.code}`);
				worksheet.cell(row, 2).string(`${element.name} • ${element.shade}, ${element.length} x ${element.ring}`);
				
				worksheet.cell(row, 6).string(`${element.quantity}`);
				worksheet.cell(row, 7).string(`${msrp}`);
				worksheet.cell(row, 8).string(`${jrPrice}`);
				worksheet.cell(row, 9).string(`${fivePackPrice}`);
				worksheet.cell(row, 10).string(`$${element.sale_price.toFixed(2)}`);
				worksheet.cell(row, 11).string(`$${element.future_price.toFixed(2)}`);
				worksheet.cell(row, 12).string(`$${element.wholesale_price}`);
				worksheet.cell(row, 13).string(`$${element.seriouscigars_price}`);
				worksheet.cell(row, 14).string(`$${element.cigars_price}`);
				row++;
			}, this);

			row += 2;

			// now = new Date();
			
		}

		return workbook;
	}
};

function stripHtmlTags(str) {
	if ((str===null) || (str==='')) return false;
	else str = str.toString();
	return str.replace(/<[^>]*>/g, '');
}