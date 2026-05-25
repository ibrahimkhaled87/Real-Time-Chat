import axios from "axios";
import { createPortal } from "react-dom";

export default function Overlay({info, onClose}) {
  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="modal">{info}</div>
    </div>,
    document.body
  );
}