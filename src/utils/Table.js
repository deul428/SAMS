import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import { apiMethods } from "./api"; // API 호출 메서드
import roots from "./datas/Roots";
import { Table as BootTable, Button } from "react-bootstrap";
function Table() {
  // API에서 데이터를 가져오기 위한 상태
  const [data, setData] = useState([]);
  const rootsData = roots[4].props;

  // API 호출
  useEffect(() => {
    const fetchData = async () => {
      try {
        const getData = await apiMethods.get("/api/biz-opp/"); // API 호출
        if (getData && Array.isArray(getData)) {
          getData.map((e, index) => {
            if(index === e.length - 1){
              const locale = getData[index].sale_amt.toLocaleString('ko-KR');
              console.log(locale);
            } 
            
          })
          const filterData = getData.filter(e => !e.STATUS);
          console.log(filterData);
          setData(filterData); // 데이터부만 filter
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // 컬럼 정의
  const columns = React.useMemo(() => rootsData, [rootsData]);
  // React Table 훅 사용
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });
  return (
    <BootTable bordered hover responsive {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()} /*-style={cellStyle}-*/>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell, index) => (
                index === row.cells.length - 1 ? (
                  <td {...cell.getCellProps()}>
                    <Button size="sm" variant="light">이력</Button>
                  </td>
                ):(
                  <td {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </td>
                )
              ))}
            </tr>
          );
        })}
      </tbody>
    </BootTable>
  );
}

export default Table;
