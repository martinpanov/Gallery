import { RefObject, useEffect, useRef } from "react";

export default function useClickOutside(handler: () => void) {
    const dropDownMenuRef: RefObject<HTMLDivElement> = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e: any) => {
            if (dropDownMenuRef.current && !dropDownMenuRef.current.contains(e.target)) {
                handler();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };

    });

    return dropDownMenuRef;
}