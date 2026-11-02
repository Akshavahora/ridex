"use client";

import { IVehicle } from "@/models/vehicle.model";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ImagePlus, IndianRupee } from "lucide-react";
import axios from "axios";

type PropsType = {
    open: boolean;
    onClose: () => void;
    data: IVehicle | null;
};

function PricingModal({ open, onClose, data }: PropsType) {
    const [image, setImage] = useState<File | null>();
    const [preview, setPreview] = useState<string | null>(null);
    const [baseFare, setBaseFare] = useState("");
    const [pricePerKM, setPricePerKM] = useState("");
    const [waitingCharge, setWaitingCharge] = useState("");
    const [ loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        try {
            const formData = new FormData()
            formData.append("baseFare", baseFare)
            formData.append("waitingCharge", waitingCharge)
            formData.append("pricePerKM", pricePerKM)

            if(image) {
                formData.append("image", image)

            }

            const {data} = await axios.post("/api/partner/onboarding/pricing", formData)
            console.log(data)

        } catch (error:any) {
            console.log(error.response.data.message | error)
        }
    }
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                >
                    <motion.div
                        initial={{ scale: 0.85 }}
                        animate={{ scale: 1 }}
                        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold">Pricing and Vehicle Image</h2>
                        </div>

                        <div className="p-6 space-y-6">
                            <label
                                htmlFor="imageLabel"
                                className="relative h-44 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer"
                            >
                                {!preview ? (
                                    <ImagePlus size={28} />
                                ) : (
                                    <img src={preview}
                                        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                                    />
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    id="imageLabel"
                                    hidden
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setImage(e.target.files[0]);
                                            setPreview(URL.createObjectURL(e.target.files[0]));
                                        }
                                    }}
                                />
                            </label>

                            <div>
                                <p className="text-sm font-semibold mb-1">Base Fare</p>
                                <div className="flex items-center gap-2 border border-xl px-4 py-3 bg-white">
                                    <IndianRupee size={18} />
                                    <input
                                        type="text"
                                        value={baseFare}
                                        onChange={(e) => setBaseFare(e.target.value)}
                                        placeholder="Enter base fare"
                                        className="w-full outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-semibold mb-1">Price Per KM</p>
                                <div className="flex items-center gap-2 border border-xl px-4 py-3 bg-white">
                                    <IndianRupee size={18} />
                                    <input
                                        type="text"
                                        value={pricePerKM}
                                        onChange={(e) => setPricePerKM(e.target.value)}
                                        placeholder="Enter price per km"
                                        className="w-full outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-semibold mb-1">Waiting Charge</p>
                                <div className="flex items-center gap-2 border border-xl px-4 py-3 bg-white">
                                    <IndianRupee size={18} />
                                    <input
                                        type="text"
                                        value={waitingCharge}
                                        onChange={(e) => setWaitingCharge(e.target.value)}
                                        placeholder="Enter waiting charge"
                                        className="w-full outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t flex gap-3">
                            <button className="flex-1 border rounded-xl py-2" onClick={onClose}>Cancel</button>
                            <button 
                                className="flex-1 bg-black text-white rounded-xl py-2" 
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default PricingModal;
