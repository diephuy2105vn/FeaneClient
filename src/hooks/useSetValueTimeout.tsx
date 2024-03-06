import { useEffect, useState } from "react";

const useSetValueTimeout = (value: string | number, timeout: number) => {
    let timeoutId: NodeJS.Timeout | null = null;
    const [valueState, setValueState] = useState<typeof value>(value);
    useEffect(() => {
        timeoutId = setTimeout(() => {
            setValueState(value);
        }, timeout);
        return () => {
            timeoutId && clearTimeout(timeoutId);
        };
    }, [value]);
    return valueState;
};
export default useSetValueTimeout;
