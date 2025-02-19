import { useEffect } from 'react';

export default function usePreventRefresh() {
    const preventRefresh = (e) => {
        e.preventDefault();
        e.returnValue = "";
    };

    useEffect(() => {
        window.addEventListener("beforeunload", preventRefresh);
        return () => {
            window.removeEventListener("beforeunload", preventRefresh);
        };
    }, []);
}