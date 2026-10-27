import { useNavigate } from "react-router";
import { CropForm } from "../components/CropForm";
import { Navbar } from "../components/Navbar";
import { FiArrowLeft } from "react-icons/fi";

export function NewCropPage () {
    const onCreate = () => {
        alert("Creating crop...")
    }
    const navigate = useNavigate();
    return (
        <div 
            className="bg-[#F2F1F8] min-h-dvh text-[#111320]"
            style={{
                fontFamily: "Inter"
            }}
        >
            <Navbar />
            <div className="p-8 pb-12 max-w-3xl mx-auto">
            <button
                type="button"
                onClick={() => navigate("/")}
                className="mb-6 inline-flex items-center gap-2 rounded-md text-sm font-medium text-gray-600 transition-colors hover:text-[#111320] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111320]/20 cursor-pointer"
            >
                <FiArrowLeft size={18} />
                Back to Dashboard
            </button>
                <div>
                    <CropForm 
                        isEditing={false} 
                        onSubmit={onCreate}
                    />
                </div>
            </div>            
        </div>
    );
}