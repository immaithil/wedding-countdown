import React, { useState, useEffect } from "react";
import "../styles/adminModel.css";

function AdminModal({ isOpen, onClose, onConfirm, mode = "auth", title, message }) {
    const [passcode, setPasscode] = useState("");

    // Reset input whenever modal opens
    useEffect(() => {
        if (isOpen) setPasscode("");
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(mode === "auth" ? passcode : true);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="glass-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-icon">
                        {mode === "auth" ? "🔐" : mode === "confirm" ? "⚠️" : "ℹ️"}
                    </span>
                    <h3>{title || (mode === "auth" ? "Admin Access" : "Confirm Action")}</h3>
                </div>
                
                <p className="modal-desc">
                    {message || "Please provide authorization to proceed."}
                </p>

                <form onSubmit={handleSubmit}>
                    {mode === "auth" && (
                        <input
                            type="password"
                            placeholder="••••••"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            className="modal-input"
                            autoFocus
                        />
                    )}

                    <div className="modal-actions">
                        {mode !== "alert" && (
                            <button type="button" className="modal-btn cancel" onClick={onClose}>
                                {mode === "confirm" ? "No, Cancel" : "Cancel"}
                            </button>
                        )}
                        <button type="submit" className="modal-btn confirm">
                            {mode === "auth" ? "Verify" : mode === "confirm" ? "Yes, Delete" : "OK"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminModal;