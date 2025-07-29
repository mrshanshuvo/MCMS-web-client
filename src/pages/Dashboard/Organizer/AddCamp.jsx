import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  Calendar,
  MapPin,
  User,
  DollarSign,
  Upload,
  Loader2,
} from "lucide-react";

const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;

const AddCamp = () => {
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [imageUploading, setImageUploading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setImageUploading(true);

      // Upload image to imgbb
      const formData = new FormData();
      formData.append("image", data.image[0]);

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

      await axiosSecure.post("/camps", campData);

      toast.success("Medical camp added successfully!");
      reset();
    } catch (error) {
      setImageUploading(false);
      toast.error("Failed to add camp. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with medical badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
            Create New Medical Camp
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Organize a
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Healthcare Camp
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Fill out the form below to add a new medical camp to our system
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                placeholder="Enter camp name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Camp Image */}
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-800">
                Camp Image*
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer ${
                    errors.image
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50"
                  } transition-colors`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="mb-3 text-gray-500" size={24} />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
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
                <p className="text-red-500 text-sm">{errors.image.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Camp Fees */}
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-800">
                  Camp Fees (USD)*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <DollarSign className="text-gray-500" size={18} />
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
                    placeholder="0.00"
                  />
                </div>
                {errors.fees && (
                  <p className="text-red-500 text-sm">{errors.fees.message}</p>
                )}
              </div>

              {/* Date and Time */}
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
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.location
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-blue-300"
                  } focus:outline-none focus:ring-2`}
                  placeholder="Enter camp location"
                />
              </div>
              {errors.location && (
                <p className="text-red-500 text-sm">
                  {errors.location.message}
                </p>
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
                  placeholder="Enter professional's name"
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
                Description (optional)
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                placeholder="Enter camp description..."
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
              {isSubmitting || imageUploading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
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
