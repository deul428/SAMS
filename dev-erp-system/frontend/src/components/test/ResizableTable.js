import React, { useRef } from 'react';

const ResizableTable = () => {
    const tableRef = useRef(null);

    // 마우스 이벤트 핸들러
    const handleMouseDown = (e, th) => {
        e.preventDefault(); // 기본 동작 방지
        const startX = e.clientX; // 초기 X 좌표
        const startWidth = th.offsetWidth; // 초기 열 너비

        const onMouseMove = (e) => {
            const newWidth = startWidth + (e.clientX - startX); // 마우스 이동에 따른 열 너비 조정
            th.style.width = `${newWidth}px`; // 열 너비 적용
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    return (
        <table
            ref={tableRef}
            className='table table-bordered'
            style={{
                width: '100%',
                tableLayout: 'fixed',
                borderCollapse: 'collapse',
            }}
        >
            <thead>
                <tr>
                    <th
                        style={{
                            position: 'relative',
                            minWidth: '100px',
                            border: '1px solid #dee2e6',
                        }}
                    >
                        Column 1
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '5px',
                                height: '100%',
                                cursor: 'col-resize',
                                backgroundColor: 'transparent',
                                userSelect: 'none',
                            }}
                            onMouseDown={(e) =>
                                handleMouseDown(e, e.target.parentElement)
                            }
                        ></div>
                    </th>
                    <th
                        style={{
                            position: 'relative',
                            minWidth: '100px',
                            border: '1px solid #dee2e6',
                        }}
                    >
                        Column 2
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '5px',
                                height: '100%',
                                cursor: 'col-resize',
                                backgroundColor: 'transparent',
                                userSelect: 'none',
                            }}
                            onMouseDown={(e) =>
                                handleMouseDown(e, e.target.parentElement)
                            }
                        ></div>
                    </th>
                    <th
                        style={{
                            position: 'relative',
                            minWidth: '100px',
                            border: '1px solid #dee2e6',
                        }}
                    >
                        Column 3
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '5px',
                                height: '100%',
                                cursor: 'col-resize',
                                backgroundColor: 'transparent',
                                userSelect: 'none',
                            }}
                            onMouseDown={(e) =>
                                handleMouseDown(e, e.target.parentElement)
                            }
                        ></div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{ border: '1px solid #dee2e6' }}>Data 1</td>
                    <td style={{ border: '1px solid #dee2e6' }}>Data 2</td>
                    <td style={{ border: '1px solid #dee2e6' }}>Data 3</td>
                </tr>
                <tr>
                    <td style={{ border: '1px solid #dee2e6' }}>Data 4</td>
                    <td style={{ border: '1px solid #dee2e6' }}>Data 5</td>
                    <td style={{ border: '1px solid #dee2e6' }}>Data 6</td>
                </tr>
            </tbody>
        </table>
    );
};

export default ResizableTable;
