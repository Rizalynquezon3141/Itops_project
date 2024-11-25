import React from 'react';

const AddEod = ({ isOpen, onClose, timeOptions, time, entry, onTimeChange, onEntryChange, onSave }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">End of Day Entry</h2>
                <label className="block mb-2">
                    Time
                    <select className="border p-2 w-full mt-1" value={time} onChange={(e) => onTimeChange(e.target.value)}>
                        <option value="">Select a time schedule</option>
                        {timeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="block mb-4">
                    Entry
                    <textarea
                        className="border p-2 w-full mt-1"
                        rows="4"
                        value={entry}
                        onChange={(e) => onEntryChange(e.target.value)}
                    />
                </label>
                <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={onSave}>
                    Save
                </button>
                <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddEod;