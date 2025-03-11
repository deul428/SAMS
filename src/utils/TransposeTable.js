export const transposeData = (tableData, tableColumns) => {
    if (!tableData || !tableData.length || !tableColumns || !tableColumns.length) {
        return { transposedColumns: [], transposedData: [] };
    }

    // 데이터에서 값만 추출
    const rows = tableData.map(row => tableColumns.map(col => row[col.accessor]));

    // 행렬 전환
    const transposed = rows[0].map((_, colIndex) => rows.map(row => row[colIndex]));

    // 전환된 데이터에 대해 새로운 컬럼 생성
    const transposedColumns = tableData.map((_, rowIndex) => ({
        Header: `Row ${rowIndex + 1}`,
        accessor: `row${rowIndex}`,
    }));

    const transposedData = transposed.map((row, index) => {
        const newRow = {};
        row.forEach((value, colIndex) => {
            newRow[`row${colIndex}`] = value;
        });
        return newRow;
    });

    return { transposedColumns, transposedData };
};
