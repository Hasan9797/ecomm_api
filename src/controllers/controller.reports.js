import serverReports from '../services/service.reports.js';

const getAllReports = async (req, res) => {
	const from = req.query.from;
	const to = req.query.to;
	const result = await serverReports.getUsersReports(from, to);
	console.log(result);
	if (result) {
		return res.status(200).json({
			message: 'successfully',
			data: result,
		});
	}
	res.status(404).json({ message: 'Error' });
};

const getUserReport = (req, res) => {};

export default { getAllReports, getUserReport };
