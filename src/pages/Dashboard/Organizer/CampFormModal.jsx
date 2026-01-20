import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Loader2, Calendar, MapPin, User, Upload, X } from "lucide-react";

import { FaBangladeshiTakaSign } from "react-icons/fa6";
const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;

const CampFormModal = ({ initialData, onClose, onUpdated }) => {
  const axiosSecure = useAxiosSecure();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // watch,
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
        const formData = new FormData();
        formData.append("image", data.image[0]);

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
          background: "#1e3a8a",
          color: "#ffffff",
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
        background: "#1e3a8a",
        color: "#ffffff",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1e3a8a] to-[#0f766e] text-white p-6 rounded-t-3xl flex justify-between items-center">
          <h3 className="text-2xl font-bold">Update Medical Camp</h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Camp Name */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-800">
              Camp Name*
            </label>
            <input
              type="text"
              {...register("name", { required: "Camp Name is required" })}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.name
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              } focus:outline-none focus:ring-2`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-800">
              Camp Image
            </label>
            <div className="flex flex-col items-center gap-4">
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
                <div className="flex flex-col items-center justify-center w-full py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors">
                  <Upload className="mb-2 text-gray-500" size={24} />
                  <p className="text-sm text-gray-600">
                    {imagePreview
                      ? "Click to change image"
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fees */}
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-800">
                Camp Fees (USD)*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaBangladeshiTakaSign className="text-gray-500" size={18} />
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register("fees", {
                    required: "Camp Fees is required",
                    min: { value: 0, message: "Fees must be positive" },
                  })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.fees
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-blue-300"
                  } focus:outline-none focus:ring-2`}
                />
              </div>
              {errors.fees && (
                <p className="text-red-500 text-sm">{errors.fees.message}</p>
              )}
            </div>

            {/* Date & Time */}
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-800">
                Date & Time*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="text-gray-500" size={18} />
                </div>
                <input
                  type="datetime-local"
                  {...register("dateTime", {
                    required: "Date & Time is required",
                  })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.dateTime
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-blue-300"
                  } focus:outline-none focus:ring-2`}
                />
              </div>
              {errors.dateTime && (
                <p className="text-red-500 text-sm">
                  {errors.dateTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-800">
              Location*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className="text-gray-500" size={18} />
              </div>
              <input
                type="text"
                {...register("location", { required: "Location is required" })}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.location
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-300"
                } focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location.message}</p>
            )}
          </div>

          {/* Healthcare Professional */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-800">
              Healthcare Professional*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="text-gray-500" size={18} />
              </div>
              <input
                type="text"
                {...register("healthcareProfessional", {
                  required: "Healthcare Professional is required",
                })}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.healthcareProfessional
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-300"
                } focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.healthcareProfessional && (
              <p className="text-red-500 text-sm">
                {errors.healthcareProfessional.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-800">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || imageUploading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 ${
              isSubmitting || imageUploading
                ? "bg-blue-400"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
            } flex items-center justify-center`}
          >
            {(isSubmitting || imageUploading) && (
              <Loader2 className="animate-spin mr-2" size={20} />
            )}
            Update Camp
          </button>
        </form>
      </div>
    </div>
  );
};

export default CampFormModal;
