import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Loader2, Calendar, MapPin, User, Upload, X } from "lucide-react";
import useImageOptimizer from "../../../hooks/useImageOptimizer";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;

const CampFormModal = ({ initialData, onClose, onUpdated }) => {
  const axiosSecure = useAxiosSecure();
  const { compressImage } = useImageOptimizer();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: initialData.name,
      fees: initialData.fees,
      dateTime: new Date(initialData.dateTime).toISOString().slice(0, 16),
      location: initialData.location,
      healthcareProfessional: initialData.healthcareProfessional,
      description: initialData.description || "",
      image: null,
    },
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData.imageURL);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      let imageURL = initialData.imageURL;

      if (data.image && data.image.length > 0) {
        setImageUploading(true);
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

        if (!imgbbData.success) throw new Error("Image upload failed");
        imageURL = imgbbData.data.display_url;
        setImageUploading(false);
      }

      const updatedCamp = {
        name: data.name,
        fees: parseFloat(data.fees),
        dateTime: data.dateTime,
        location: data.location,
        healthcareProfessional: data.healthcareProfessional,
        description: data.description || "",
        imageURL,
      };

      const res = await axiosSecure.patch(
        `/camps/${initialData._id}`,
        updatedCamp
      );

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Camp updated successfully!",
          timer: 2000,
          showConfirmButton: false,
          background: "#ffffff",
          color: "#1f2937",
        });
        onUpdated();
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong!",
        confirmButtonColor: "#ff1e00",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-[#ff1e00] text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-xl font-bold">Update Medical Camp</h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Camp Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Camp Name <span className="text-[#ff1e00]">*</span>
            </label>
            <input
              type="text"
              {...register("name", { required: "Camp Name is required" })}
              className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#ff1e00] transition-all ${errors.name
                ? "border-[#ff1e00]"
                : "border-gray-200"
                }`}
            />
            {errors.name && (
              <p className="text-[#ff1e00] text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Camp Image
            </label>
            <div className="flex flex-col items-center gap-3">
              {imagePreview && (
                <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Camp Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <label className="flex flex-col items-center justify-center w-full cursor-pointer">
                <div className={`flex flex-col items-center justify-center w-full py-4 border-2 border-dashed rounded-xl transition-all ${imagePreview
                  ? "border-gray-200 hover:border-[#ff1e00]"
                  : "border-gray-200 hover:border-[#ff1e00] bg-[#e8f9fd]/30 hover:bg-[#e8f9fd]"
                  }`}>
                  <Upload className="mb-2 text-gray-400" size={20} />
                  <p className="text-sm text-gray-500">
                    {imagePreview
                      ? "Click to change image"
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("image", {
                    onChange: handleImageChange,
                  })}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Fees */}
            <div className="space-y-1.5">
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
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#ff1e00] transition-all ${errors.fees
                    ? "border-[#ff1e00]"
                    : "border-gray-200"
                    }`}
                />
              </div>
              {errors.fees && (
                <p className="text-[#ff1e00] text-sm">{errors.fees.message}</p>
              )}
            </div>

            {/* Date & Time */}
            <div className="space-y-1.5">
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
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#ff1e00] transition-all ${errors.dateTime
                    ? "border-[#ff1e00]"
                    : "border-gray-200"
                    }`}
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
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Location <span className="text-[#ff1e00]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className="text-gray-400" size={16} />
              </div>
              <input
                type="text"
                {...register("location", { required: "Location is required" })}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#ff1e00] transition-all ${errors.location
                  ? "border-[#ff1e00]"
                  : "border-gray-200"
                  }`}
              />
            </div>
            {errors.location && (
              <p className="text-[#ff1e00] text-sm">{errors.location.message}</p>
            )}
          </div>

          {/* Healthcare Professional */}
          <div className="space-y-1.5">
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
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#ff1e00] transition-all ${errors.healthcareProfessional
                  ? "border-[#ff1e00]"
                  : "border-gray-200"
                  }`}
              />
            </div>
            {errors.healthcareProfessional && (
              <p className="text-[#ff1e00] text-sm">
                {errors.healthcareProfessional.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff1e00] transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || imageUploading}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${isSubmitting || imageUploading
              ? "bg-[#ff1e00]/50 cursor-not-allowed"
              : "bg-[#ff1e00] hover:bg-[#ff1e00]/90 shadow-sm hover:shadow-md cursor-pointer"
              } flex items-center justify-center`}
          >
            {(isSubmitting || imageUploading) && (
              <Loader2 className="animate-spin mr-2" size={18} />
            )}
            Update Camp
          </button>
        </form>
      </div>
    </div>
  );
};

export default CampFormModal;