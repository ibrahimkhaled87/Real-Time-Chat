import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Message({status, info, onClose}) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return createPortal (
        <div className="alertMessage">
            <img src={`/images/message/${status}.svg`} alt="" />
            <p>{info}</p>
        </div>,
        document.body
    );
}