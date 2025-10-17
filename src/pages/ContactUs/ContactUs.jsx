import React, { useRef, useState, useMemo, useCallback } from "react";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Star,
} from "lucide-react";

// Constants
const CONTACT_INFO = [
  {
    icon: <Mail className="text-[#495E57]" size={20} />,
    title: "Email",
    value: "support@mcms.com",
    action: "mailto:support@mcms.com",
    actionText: "Send us an email",
    bgColor: "bg-[#495E57]/10",
  },
  {
    icon: <Phone className="text-[#495E57]" size={20} />,
    title: "Phone",
    value: "+880-1234-567890",
    action: "tel:+8801234567890",
    actionText: "Call us now",
    bgColor: "bg-[#495E57]/10",
  },
  {
    icon: <MapPin className="text-[#495E57]" size={20} />,
    title: "Address",
    value: "123 Health St, Dhaka, Bangladesh",
    action: "https://maps.google.com",
    actionText: "View on map",
    bgColor: "bg-[#495E57]/10",
    fullWidth: true,
  },
];

const SOCIAL_LINKS = [
  {
    icon: <Facebook size={20} />,
    label: "Facebook",
    url: "#",
    color: "bg-[#495E57]/10 text-[#495E57] hover:bg-[#495E57]/20",
  },
  {
    icon: <Twitter size={20} />,
    label: "Twitter",
    url: "#",
    color: "bg-[#495E57]/10 text-[#495E57] hover:bg-[#495E57]/20",
  },
  {
    icon: <Instagram size={20} />,
    label: "Instagram",
    url: "#",
    color: "bg-[#495E57]/10 text-[#495E57] hover:bg-[#495E57]/20",
  },
  {
    icon: <Linkedin size={20} />,
    label: "LinkedIn",
    url: "#",
    color: "bg-[#495E57]/10 text-[#495E57] hover:bg-[#495E57]/20",
  },
];

const ContactUs = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  // Environment variables with fallbacks
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Memoized toast styles
  const toastStyles = useMemo(
    () => ({
      success: {
        style: {
          background: "#10B981",
          color: "#fff",
        },
      },
      error: {
        style: {
          background: "#EF4444",
          color: "#fff",
        },
      },
    }),
    []
  );

  const sendEmail = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      // Basic form validation
      const formData = new FormData(form.current);
      const name = formData.get("user_name");
      const email = formData.get("user_email");
      const message = formData.get("message");

      if (!name || !email || !message) {
        toast.error("Please fill in all required fields.", toastStyles.error);
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address.", toastStyles.error);
        setLoading(false);
        return;
      }

      try {
        await emailjs.sendForm(
          SERVICE_ID,
          TEMPLATE_ID,
          form.current,
          PUBLIC_KEY
        );

        toast.success(
          "Message sent successfully! We'll get back to you soon.",
          toastStyles.success
        );
        form.current.reset();
      } catch (error) {
        console.error("EmailJS Error:", error);
        toast.error(
          "Failed to send message. Please try again or contact us directly.",
          toastStyles.error
        );
      } finally {
        setLoading(false);
      }
    },
    [SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY, toastStyles]
  );

  // Memoized components
  const HeaderSection = useMemo(
    () => (
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-[#495E57]/10 rounded-full text-[#495E57] font-medium mb-4">
          <Star size={16} className="text-[#F4CE14] mr-2" fill="#F4CE14" />
          Contact Support
        </div>
        <h1 className="text-4xl font-bold text-[#45474B] mb-4">
          Get in
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]">
            {" "}
            Touch
          </span>
        </h1>
        <p className="text-xl text-[#45474B]/70 max-w-3xl mx-auto leading-relaxed">
          Have questions or feedback? We're here to help and would love to hear
          from you.
        </p>
      </div>
    ),
    []
  );

  const ContactForm = useMemo(
    () => (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#495E57]/10">
        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-[#45474B] mb-6">
            Send us a message
          </h2>
          <form
            ref={form}
            onSubmit={sendEmail}
            className="space-y-5"
            noValidate
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#45474B] mb-1"
              >
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="user_name"
                required
                className="w-full px-4 py-3 border border-[#495E57]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:border-transparent bg-white transition-colors duration-200"
                placeholder="Elon Musk"
                aria-required="true"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#45474B] mb-1"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="user_email"
                required
                className="w-full px-4 py-3 border border-[#495E57]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:border-transparent bg-white transition-colors duration-200"
                placeholder="you@example.com"
                aria-required="true"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[#45474B] mb-1"
              >
                Your Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                className="w-full px-4 py-3 border border-[#495E57]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:border-transparent bg-white transition-colors duration-200 resize-vertical"
                placeholder="How can we help you?"
                aria-required="true"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 ${
                loading
                  ? "bg-[#495E57]/50 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-[#495E57] to-[#495E57]/90 text-white hover:shadow-lg"
              }`}
              aria-label={loading ? "Sending message..." : "Send message"}
            >
              {loading ? (
                <>
                  <Loader2
                    className="animate-spin mr-2"
                    size={18}
                    aria-hidden="true"
                  />
                  Sending...
                </>
              ) : (
                <>
                  <Send
                    className="mr-2 text-[#F4CE14]"
                    size={18}
                    aria-hidden="true"
                  />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    ),
    [loading, sendEmail]
  );

  const ContactInfoCards = useMemo(
    () => (
      <div className="grid sm:grid-cols-2 gap-4">
        {CONTACT_INFO.map((info, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-2xl shadow-sm border border-[#495E57]/10 hover:shadow-md transition-all duration-200 ${
              info.fullWidth ? "sm:col-span-2" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${info.bgColor}`}>
                {info.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#45474B] mb-1">
                  {info.title}
                </h3>
                <p className="text-[#45474B]/70">{info.value}</p>
                <a
                  href={info.action}
                  target={info.action.startsWith("http") ? "_blank" : undefined}
                  rel={
                    info.action.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="text-[#495E57] hover:text-[#45474B] hover:underline text-sm mt-2 inline-block transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 rounded"
                >
                  {info.actionText}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    []
  );

  const SocialLinks = useMemo(
    () => (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#495E57]/10">
        <h3 className="font-semibold text-[#45474B] mb-4">Connect with us</h3>
        <div className="flex gap-3" role="list" aria-label="Social media links">
          {SOCIAL_LINKS.map((social, index) => (
            <a
              key={index}
              href={social.url}
              className={`p-3 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 ${social.color}`}
              aria-label={social.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    ),
    []
  );

  const MapSection = useMemo(
    () => (
      <div className="bg-white rounded-2xl shadow-sm border border-[#495E57]/10 overflow-hidden h-64 sm:h-80">
        <iframe
          title="MCMS Location - Dhaka, Bangladesh"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.787582899769!2d90.40729131488687!3d23.872331284528456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c4b4c4f34b8d%3A0xe1e88f437e6f4033!2sDhaka!5e0!3m2!1sen!2sbd!4v1650000000000"
          width="100%"
          height="100%"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="border-0"
          aria-label="Interactive map showing MCMS location in Dhaka, Bangladesh"
        ></iframe>
      </div>
    ),
    []
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#F5F7F8] to-white py-16 px-4 sm:px-6 lg:px-8"
      role="main"
      aria-label="Contact Us"
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          ...toastStyles,
        }}
      />
      <div className="max-w-6xl mx-auto">
        {HeaderSection}

        <div className="grid lg:grid-cols-2 gap-8">
          {ContactForm}

          {/* Contact Info + Map */}
          <div className="space-y-8">
            {ContactInfoCards}
            {SocialLinks}
            {MapSection}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ContactUs);
