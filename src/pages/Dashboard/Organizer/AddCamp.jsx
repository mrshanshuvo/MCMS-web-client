import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Calendar, MapPin, User, Upload, Loader2, Activity } from "lucide-react";
import useImageOptimizer from "../../../hooks/useImageOptimizer";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;

const AddCamp = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { compressImage } = useImageOptimizer();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [imageUploading, setImageUploading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setImageUploading(true);

      // Upload image to imgbb
      const optimizedFile = await compressImage(data.image[0], {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
      });

      const formData = new FormData();
      formData.append("image", optimizedFile);

      const imgbbRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
        { method: "POST", body: formData }
      );
      const imgbbData = await imgbbRes.json();

      if (!imgbbData.success) {
        throw new Error("Image upload failed");
      }

      const imageURL = imgbbData.data.display_url;

      setImageUploading(false);

      const campData = {
        name: data.name,
        imageURL,
        fees: parseFloat(data.fees),
        dateTime: data.dateTime,
        location: data.location,
        healthcareProfessional: data.healthcareProfessional,
        participantCount: 0,
        description: data.description || "",
      };

      const response = await axiosSecure.post("/camps", campData);

      if (response.data.campId) {
        Swal.fire({
          icon: "success",
          title: "Medical Camp Created!",
          html: `
            <p class="text-gray-600">Your camp was submitted successfully.</p>
            <button id="goDashboard" style="
              margin-top: 16px;
              background-color: #ff1e00;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 12px;
              cursor: pointer;
              font-weight: 500;
              transition: all 0.2s;
            ">
              Go to Manage Camps
            </button>
          `,
          showConfirmButton: false,
          showCloseButton: true,
          customClass: {
            popup: "rounded-xl",
          },
          didOpen: () => {
            const btn = Swal.getPopup().querySelector("#goDashboard");
            btn.addEventListener("click", () => {
              Swal.close();
              navigate("/dashboard/manage-camps");
            });
            btn.addEventListener("mouseenter", () => {
              btn.style.backgroundColor = "#ff1e00dd";
            });
            btn.addEventListener("mouseleave", () => {
              btn.style.backgroundColor = "#ff1e00";
            });
          },
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        confirmButtonColor: "#ff1e00",
      });
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Form card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Camp Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Camp Name <span className="text-[#ff1e00]">*</span>
              </label>
              <input
                type="text"
                {...register("name", { required: "Camp Name is required" })}
                className={`w-full px-4 py-3 rounded-xl border ${errors.name
                  ? "border-[#ff1e00] focus:ring-[#ff1e00]"
                  : "border-gray-200 focus:ring-[#ff1e00]"
                  } focus:outline-none focus:ring-2 transition-all`}
                placeholder="Enter camp name"
              />
              {errors.name && (
                <p className="text-[#ff1e00] text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Camp Image */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Camp Image <span className="text-[#ff1e00]">*</span>
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${errors.image
                    ? "border-[#ff1e00] bg-[#ff1e00]/5"
                    : "border-gray-200 hover:border-[#ff1e00] bg-[#e8f9fd]/30 hover:bg-[#e8f9fd]"
                    }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="mb-2 text-gray-400" size={20} />
                    <p className="mb-1 text-sm text-gray-500">
                      <span className="font-semibold text-[#ff1e00]">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG (MAX. 5MB)</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("image", {
                      required: "Camp Image is required",
                    })}
                  />
                </label>
              </div>
              {errors.image && (
                <p className="text-[#ff1e00] text-sm">{errors.image.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Camp Fees */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Camp Fees (USD) <span className="text-[#ff1e00]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaBangladeshiTakaSign className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    {...register("fees", {
                      required: "Camp Fees is required",
                      min: { value: 0, message: "Fees must be positive" },
                    })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.fees
                      ? "border-[#ff1e00] focus:ring-[#ff1e00]"
                      : "border-gray-200 focus:ring-[#ff1e00]"
                      } focus:outline-none focus:ring-2 transition-all`}
                    placeholder="0.00"
                  />
                </div>
                {errors.fees && (
                  <p className="text-[#ff1e00] text-sm">{errors.fees.message}</p>
                )}
              </div>

              {/* Date and Time */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Date & Time <span className="text-[#ff1e00]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="datetime-local"
                    {...register("dateTime", {
                      required: "Date & Time is required",
                    })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.dateTime
                      ? "border-[#ff1e00] focus:ring-[#ff1e00]"
                      : "border-gray-200 focus:ring-[#ff1e00]"
                      } focus:outline-none focus:ring-2 transition-all`}
                  />
                </div>
                {errors.dateTime && (
                  <p className="text-[#ff1e00] text-sm">
                    {errors.dateTime.message}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Location <span className="text-[#ff1e00]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MapPin className="text-gray-400" size={16} />
                </div>
                <input
                  type="text"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.location
                    ? "border-[#ff1e00] focus:ring-[#ff1e00]"
                    : "border-gray-200 focus:ring-[#ff1e00]"
                    } focus:outline-none focus:ring-2 transition-all`}
                  placeholder="Enter camp location"
                />
              </div>
              {errors.location && (
                <p className="text-[#ff1e00] text-sm">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Healthcare Professional */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Healthcare Professional <span className="text-[#ff1e00]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="text-gray-400" size={16} />
                </div>
                <input
                  type="text"
                  {...register("healthcareProfessional", {
                    required: "Healthcare Professional is required",
                  })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.healthcareProfessional
                    ? "border-[#ff1e00] focus:ring-[#ff1e00]"
                    : "border-gray-200 focus:ring-[#ff1e00]"
                    } focus:outline-none focus:ring-2 transition-all`}
                  placeholder="Enter professional's name"
                />
              </div>
              {errors.healthcareProfessional && (
                <p className="text-[#ff1e00] text-sm">
                  {errors.healthcareProfessional.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Description (optional)
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff1e00] transition-all resize-none"
                placeholder="Enter camp description..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || imageUploading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${isSubmitting || imageUploading
                ? "bg-[#ff1e00]/50 cursor-not-allowed"
                : "bg-[#ff1e00] hover:bg-[#ff1e00]/90 shadow-sm hover:shadow-md cursor-pointer"
                } flex items-center justify-center`}
            >
              {isSubmitting || imageUploading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Processing...
                </>
              ) : (
                "Create Medical Camp"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCamp;