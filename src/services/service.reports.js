import usersRepositorys from '../repositories/repo.reports.js';

const getUserReport = async () => {};

const getUsersReports = async (from, to) => {
	const result = await usersRepositorys.getAllReport(from, to);
	const cleanResult = result.map(record => record.toJSON());

	const totalReportByStatus = [];
	let totalOrdersCount = 0;
	// All groups by status
	cleanResult.forEach(element => {
		// orders
		element.orders.forEach(item => {
			totalOrdersCount++;
			let amount = 0;
			let count = 0;
			// products by order
			item.products.forEach(product => {
				count += 1;
				amount += product.price;
			});
			// report orders by status
			totalReportByStatus.push({ status: item.status, amount, count });
		});
	});

	let totalOrdersAmount = 0;
	totalReportByStatus.forEach(report => {
		totalOrdersAmount += report.amount;
	});
	return {
		reportAll: { totalOrdersCount, totalOrdersAmount },
		reportByStatus: totalReportByStatus,
	};
};

export default { getUserReport, getUsersReports };
