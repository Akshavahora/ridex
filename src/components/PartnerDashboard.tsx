"use client";
import { RootState } from "@/redux/store";
import { title } from "process";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { Check, Clock, Lock, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import RejectionCard from "./RejectionCard";
import StatusCard from "./StatusCard";
import ActionCard from "./ActionCard";
import axios from "axios";
import { IVehicle } from "@/models/vehicle.model";
import PricingModal from "./PricingModal";

type Step = {
  id: number;
  title: string;
  route?: string;
};

// ============ STEPS =============
const STEPS: Step[] = [
  { id: 1, title: "Vehicle", route: "/partner/onboarding/vehicle" },
  { id: 2, title: "Documents", route: "/partner/onboarding/documents" },
  { id: 3, title: "Bank", route: "/partner/onboarding/bank" },
  { id: 4, title: "Review" },
  { id: 5, title: "Video KYC" },
  { id: 6, title: "Pricing" },
  { id: 7, title: "Final Review" },
  { id: 8, title: "Live" },
];

const TOTAL_STEPS = STEPS.length;

function PartnerDashboard() {
  const [activeStep, setActiveStep] = useState(0);
  const { userData } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [requestLoading, setRequestLoading] = useState(false);

  const [showPricing, setShowPricing] = useState(false);
  const [vehicleData, setVehicleData] = useState<IVehicle | null>();
  useEffect(() => {
    if (userData) {
      setActiveStep(userData.partnerOnBoardingSteps + 1);
    }
  }, [userData]);

  const handleGetPricing = async () => {
    try {
      const { data } = await axios.get("/api/partner/onboarding/pricing");
      console.log(data);
      setVehicleData(data.vehicle);
    } catch (error) {
      console.error("Error fetching pricing:", error);
    }
  };

  useEffect(() => {
    handleGetPricing();
  }, []);

  //routing
  const goToStep = (step: Step) => {
    if (
      step.id == 6 &&
      userData?.partnerStatus === "approved" &&
      userData.videoKycStatus === "approved"
    ) {
      setShowPricing(true);
      return;
    }
    if (step.route && step.id <= activeStep) {
      router.push(step.route);
    }
  };

  const progressPercentage = ((activeStep - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="min-h-screen bg-liner-to-br from-gray-100 to-gray-200 px-4 pt-28 pb-20">
      <div className="max-w-7xl mx-auto space-y-16">
        <div>
          <h1 className="text-4xl font-bold">Partner Onboarding</h1>
          <p className="text-grey-600 mt-3">
            Complete all steps to activate your account
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-3xl shadow-xl border overflow-x-auto ">
          <div className="relative min-w-[800px]  ">
            <div className="absolute top-7 left-0 w-full h-[3px] bg-gray-200 rounded-full" />
            <motion.div
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.6 }}
              className="absolute top-7 left-0 h-[3px] bg-black rounded-full"
            />

            <div className="relative flex justify-between">
              {STEPS.map((s, index) => {
                const completed = s.id < activeStep;
                const active = s.id === activeStep;
                const locked = s.id > activeStep;

                return (
                  <motion.div
                    key={s.id}
                    whileHover={!locked ? { scale: 1.1 } : {}}
                    onClick={() => goToStep(s)}
                    className="flex flex-col items-center z-10 cursor-pointer"
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center 
                                    justify-center border-2 transition-all
                                    ${
                                      completed
                                        ? "bg-black text-white border-black"
                                        : active
                                          ? "border-black bg-white"
                                          : "border-gray-300 text-gray-400 bg-white"
                                    }`}
                    >
                      {completed ? (
                        <Check size={20} />
                      ) : locked ? (
                        <Lock size={20} />
                      ) : (
                        s.id
                      )}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-center ">
                      {s.title}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* condition for rejection */}
        {activeStep == 4 && userData?.partnerStatus === "rejected" && (
          <RejectionCard
            title="Partner Rejected"
            reason={userData.rejectionReason}
            actionLabel={`Review and Update`}
            onAction={() => {
              router.push("/partner/onboarding/vehicle");
            }}
          />
        )}

        {activeStep == 4 && userData?.partnerStatus === "pending" && (
          <StatusCard
            icon={<Clock size={18} />}
            title={"Documents under review"}
            desc={"Admin is verifying your documents."}
          />
        )}

        {activeStep == 5 &&
          (userData?.videoKycStatus === "approved" ? (
            <StatusCard
              icon={<Check size={18} />}
              title={"Video Kyc approved"}
              desc={"You can now proceed to pricing."}
            />
          ) : userData?.videoKycStatus === "rejected" ? (
            <RejectionCard
              title="Video KYC Rejected"
              reason={userData?.videoKycRejectionReason}
              actionLabel={requestLoading ? "requesting..." : "Request Again"}
              onAction={async () => {
                setRequestLoading(true);
                await axios.get("/api/partner/video-kyc/request");
                setRequestLoading(false);
              }}
            />
          ) : userData?.videoKycStatus === "in_progress" &&
            userData?.videoKycRoomId ? (
            <ActionCard
              icon={<Video size={18} />}
              title={"Admin Started Video KYC"}
              button={"Join Call"}
              onclick={() =>
                router.push(`/video-kyc/${userData.videoKycRoomId}`)
              }
            />
          ) : (
            <StatusCard
              icon={<Clock size={18} />}
              title="Waiting for Admin"
              desc="Admin will initiate Video KYC shortly."
            />
          ))}

        {activeStep === 7 && vehicleData?.status === "pending" && (
          <StatusCard
            icon={<Clock size={20} />}
            title="Pricing Under Review"
            desc="Admin is reviewing your pricing."
          />
        )}
      </div>

      <PricingModal
        open={showPricing}
        onClose={() => setShowPricing(false)}
        data={vehicleData || null}
      />
    </div>
  );
}

export default PartnerDashboard;
