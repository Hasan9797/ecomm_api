import usersRepositorys from '../repositories/repo.reports.js';

const getUserReport = async () => {};

const getUsersReports = (from, to) => {
	return usersRepositorys.findAllReports(from, to);
};

export default { getUserReport, getUsersReports };
