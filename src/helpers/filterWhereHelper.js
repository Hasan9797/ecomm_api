'use strict';

export const buildWhereClause = (filters, tableAlias = '') => {
    let whereClause = ' WHERE 1=1';
    const replacements = [];

    for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
            if (key === 'user_name' || key === 'user_number' || key === 'title') {
                // LIKE operatori uchun (bir nechta maydonlarda qidirish mumkin)
                if (key === 'title') {
                    whereClause += ` AND (${tableAlias}title_uz LIKE ? OR ${tableAlias}title_ru LIKE ?)`;
                    replacements.push(`%${filters[key]}%`, `%${filters[key]}%`);
                } else {
                    whereClause += ` AND ${tableAlias}${key} LIKE ?`;
                    replacements.push(`%${filters[key]}%`);
                }
            } else if (key === 'from_to') {
                // Sana oralig‘i uchun
                const [from, to] = filters[key].split('-');
                if (from && to) {
                    whereClause += ` AND ${tableAlias}created_at >= ? AND ${tableAlias}created_at <= ?`;
                    replacements.push(parseInt(from), parseInt(to));
                }
            } else {
                // Oddiy tenglik sharti
                whereClause += ` AND ${tableAlias}${key} = ?`;
                replacements.push(filters[key]);
            }
        }
    }

    return { whereClause, replacements };
};

export const buildQuery = async (
    SQL,
    baseQuery,
    baseCountQuery,
    filters,
    limit,
    offset,
    tableAlias = ''
) => {
    // Filterlarni qayta ishlash
    const { whereClause, replacements } = buildWhereClause(filters, tableAlias);

    // Count query
    const countQuery = baseCountQuery + whereClause;
    const [countResult] = await SQL.query(countQuery, {
        replacements,
        type: SQL.QueryTypes.SELECT,
    });

    const count = countResult?.count || 0;
    if (count === 0) {
        return {
            totalItems: 0,
            totalPages: 0,
            currentPage: 0,
            rows: [],
        };
    }

    // Asosiy query
    const query = `${baseQuery}${whereClause} ORDER BY ${tableAlias || ''}id DESC LIMIT ? OFFSET ?`;
    replacements.push(limit, offset);

    const rows = await SQL.query(query, {
        replacements,
        type: SQL.QueryTypes.SELECT,
        raw: true,
    });

    // const formattedRows = rows.map((row) => ({
    //     ...row,
    //     created_at: dateHelper(row.created_at),
    //     updated_at: dateHelper(row.updated_at),
    //     unixTime: {
    //         created_at: Number(row.created_at),
    //         updated_at: Number(row.updated_at),
    //     },
    // }));

    const totalPages = Math.ceil(count / limit);
    return { totalItems: count, totalPages, rows: rows };
};
