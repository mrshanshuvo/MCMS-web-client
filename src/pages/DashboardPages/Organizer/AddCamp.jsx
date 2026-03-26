import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  Calendar,
  MapPin,
  User,
  Upload,
  Info,
  DollarSign,
  FileText,
  X,
  Image as ImageIcon,
} from "lucide-react";
import useImageOptimizer from "../../../hooks/useImageOptimizer";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import Loader from "../../../components/Shared/Loader";


const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;

const AddCamp = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { compressImage } = useImageOptimizer();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const [imageUploading, setImageUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setValue("image", null);
  };

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
          html: `<p class="text-gray-600">Your camp was submitted successfully.</p>`,
          showConfirmButton: true,
          confirmButtonText: "Go to Manage Camps",
          confirmButtonColor: "#ff1e00",
          showCloseButton: true,
          customClass: {
            popup: "rounded-2xl",
            confirmButton: "rounded-xl px-6 py-2",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/dashboard/manage-camps");
          }
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        confirmButtonColor: "#ff1e00",
        customClass: {
          popup: "rounded-2xl",
        },
      });
      setImageUploading(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: General Info & Description */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
                  <Info className="text-[#ff1e00]" size={20} />
                  <h2 className="text-xl font-semibold text-gray-800">General Information</h2>
                </div>

                {/* Camp Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Camp Name <span className="text-[#ff1e00]">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: "Camp Name is required" })}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.name
                      ? "border-[#ff1e00] focus:ring-[#ff1e00]/20"
                      : "border-gray-200 focus:ring-[#ff1e00]/20 focus:border-[#ff1e00]"
                      } focus:outline-none focus:ring-4 transition-all bg-gray-50/50`}
                    placeholder="Enter camp name"
                  />
                  {errors.name && (
                    <p className="text-[#ff1e00] text-sm flex items-center gap-1">
                      <X size={14} /> {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description (optional)
                  </label>
                  <div className="relative">
                    <textarea
                      {...register("description")}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#ff1e00]/20 focus:border-[#ff1e00] transition-all bg-gray-50/50 resize-none"
                      placeholder="Enter detailed camp description..."
                    />
                    <div className="absolute top-3 right-3 text-gray-300 pointer-events-none">
                      <FileText size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistics Section */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
                  <MapPin className="text-[#ff1e00]" size={20} />
                  <h2 className="text-xl font-semibold text-gray-800">Logistics & Fees</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Location <span className="text-[#ff1e00]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MapPin className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        {...register("location", { required: "Location is required" })}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.location
                          ? "border-[#ff1e00] focus:ring-[#ff1e00]/20"
                          : "border-gray-200 focus:ring-[#ff1e00]/20 focus:border-[#ff1e00]"
                          } focus:outline-none focus:ring-4 transition-all bg-gray-50/50`}
                        placeholder="City, Region"
                      />
                    </div>
                    {errors.location && (
                      <p className="text-[#ff1e00] text-sm flex items-center gap-1">
                        <X size={14} /> {errors.location.message}
                      </p>
                    )}
                  </div>

                  {/* Camp Fees */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Camp Fees (USD) <span className="text-[#ff1e00]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        {...register("fees", {
                          required: "Camp Fees is required",
                          min: { value: 0, message: "Fees must be positive" },
                        })}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.fees
                          ? "border-[#ff1e00] focus:ring-[#ff1e00]/20"
                          : "border-gray-200 focus:ring-[#ff1e00]/20 focus:border-[#ff1e00]"
                          } focus:outline-none focus:ring-4 transition-all bg-gray-50/50`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.fees && (
                      <p className="text-[#ff1e00] text-sm flex items-center gap-1">
                        <X size={14} /> {errors.fees.message}
                      </p>
                    )}
                  </div>

                  {/* Date and Time */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Date & Time <span className="text-[#ff1e00]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="datetime-local"
                        {...register("dateTime", { required: "Date & Time is required" })}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.dateTime
                          ? "border-[#ff1e00] focus:ring-[#ff1e00]/20"
                          : "border-gray-200 focus:ring-[#ff1e00]/20 focus:border-[#ff1e00]"
                          } focus:outline-none focus:ring-4 transition-all bg-gray-50/50 cursor-pointer`}
                      />
                    </div>
                    {errors.dateTime && (
                      <p className="text-[#ff1e00] text-sm flex items-center gap-1">
                        <X size={14} /> {errors.dateTime.message}
                      </p>
                    )}
                  </div>

                  {/* Healthcare Professional */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Healthcare Professional <span className="text-[#ff1e00]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        {...register("healthcareProfessional", {
                          required: "Healthcare Professional is required",
                        })}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.healthcareProfessional
                          ? "border-[#ff1e00] focus:ring-[#ff1e00]/20"
                          : "border-gray-200 focus:ring-[#ff1e00]/20 focus:border-[#ff1e00]"
                          } focus:outline-none focus:ring-4 transition-all bg-gray-50/50`}
                        placeholder="Professional's name"
                      />
                    </div>
                    {errors.healthcareProfessional && (
                      <p className="text-[#ff1e00] text-sm flex items-center gap-1">
                        <X size={14} /> {errors.healthcareProfessional.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Image Upload & Actions */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                  <ImageIcon className="text-[#ff1e00]" size={20} />
                  <h2 className="text-lg font-semibold text-gray-800">Media</h2>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Camp Poster <span className="text-[#ff1e00]">*</span>
                  </label>

                  {previewUrl ? (
                    <div className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-video">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={clearImage}
                          className="bg-white text-gray-900 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                        >
                          <X size={20} className="text-[#ff1e00]" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="dropzone-file"
                      className={`flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-2xl cursor-pointer transition-all ${errors.image
                        ? "border-[#ff1e00] bg-[#ff1e00]/5"
                        : "border-gray-200 hover:border-[#ff1e00]/50 hover:bg-[#ff1e00]/5 bg-gray-50/50"
                        }`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="p-3 bg-white rounded-xl shadow-sm mb-3">
                          <Upload className="text-gray-400 group-hover:text-[#ff1e00]" size={24} />
                        </div>
                        <p className="mb-1 text-sm text-gray-600 font-medium">
                          Click to upload camp poster
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...register("image", {
                          required: "Camp Image is required",
                          onChange: handleImageChange,
                        })}
                      />
                    </label>
                  )}
                  {errors.image && (
                    <p className="text-[#ff1e00] text-sm flex items-center gap-1">
                      <X size={14} /> {errors.image.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting || imageUploading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform active:scale-[0.98] cursor-pointer ${isSubmitting || imageUploading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#ff1e00] hover:bg-[#ff1e00]/90 shadow-[0_10px_20px_-10px_rgba(255,30,0,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(255,30,0,0.6)]"
                    } flex items-center justify-center gap-2`}
                >
                  {isSubmitting || imageUploading ? (
                    <Loader inline size="sm" variant="spinner" message="Creating Session..." />
                  ) : (
                    <span>Create Medical Camp</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/manage-camps")}
                  className="w-full py-4 px-6 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCamp;
