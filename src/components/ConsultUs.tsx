import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ConsultUs() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    passingYear: "",
    neetScore: "",
    neetYear: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-consult-us", handleOpen);
    return () => {
      window.removeEventListener("open-consult-us", handleOpen);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/consultations", {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        passingYear: formData.passingYear,
        neetScore: Number(formData.neetScore),
        neetYear: formData.neetYear,
        location: formData.location
      });
      if (response.status === 201 || response.status === 200) {
        toast.success("Consultation request submitted successfully!");
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          passingYear: "",
          neetScore: "",
          neetYear: "",
          location: ""
        });
        setOpen(false); // Close slider
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Registration Toggle Button */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{
          opacity: 0,
          y: 50
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        whileHover={{
          scale: 1.05
        }}
        whileTap={{
          scale: 0.95
        }}
        className="
          fixed
          right-5
          bottom-8
          z-50
          bg-gradient-to-r
          from-emerald-600
          to-orange-500
          text-white
          font-bold
          px-6
          py-4
          rounded-full
          shadow-2xl
          cursor-pointer
        "
      >
        Consult US
      </motion.button>

      {/* SLIDER */}
      <AnimatePresence>
        {open && (
          <>
            {/* BACKGROUND OVERLAY */}
            <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 0.5
              }}
              exit={{
                opacity: 0
              }}
              onClick={() => !loading && setOpen(false)}
              className="
                fixed
                inset-0
                z-[9998]
                bg-black
              "
            />

            {/* SLIDING PANEL */}
            <motion.div
              initial={{
                x: "100%"
              }}
              animate={{
                x: 0
              }}
              exit={{
                x: "100%"
              }}
              transition={{
                type: "tween",
                duration: 0.4
              }}
              className="
                fixed
                right-0
                top-0
                bottom-0
                w-full
                sm:w-[480px]
                bg-white
                z-[9999]
                shadow-2xl
                p-6
                overflow-y-auto
              "
            >
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="
                  absolute
                  top-5
                  right-5
                  p-2
                  rounded-full
                  bg-gray-100
                  text-gray-500
                  hover:bg-orange-500
                  hover:text-white
                  disabled:opacity-50
                  transition
                  cursor-pointer
                "
              >
                <X size={22} />
              </button>

              <div className="mt-10">
                <span
                  className="
                    inline-block
                    bg-orange-100
                    text-orange-600
                    px-5
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                  "
                >
                  Contact Us
                </span>

                <h2
                  className="
                    mt-5
                    text-3xl
                    font-extrabold
                    text-gray-900
                    leading-tight
                  "
                >
                  Consult With Us{" "}
                  <span
                    className="
                      text-emerald-600
                    "
                  >
                    MBBS Bangladesh
                  </span>
                </h2>

                <p
                  className="
                    mt-4
                    text-gray-600
                  "
                >
                  Get complete MBBS admission details, fees and college information.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="
                    mt-8
                    space-y-5
                  "
                >
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    disabled={loading}
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-gray-200
                      outline-none
                      focus:ring-2
                      focus:ring-emerald-500
                      disabled:bg-gray-50
                      disabled:text-gray-400
                    "
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                    disabled={loading}
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-gray-200
                      outline-none
                      focus:ring-2
                      focus:ring-emerald-500
                      disabled:bg-gray-50
                      disabled:text-gray-400
                    "
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    disabled={loading}
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-gray-200
                      outline-none
                      focus:ring-2
                      focus:ring-emerald-500
                      disabled:bg-gray-50
                      disabled:text-gray-400
                    "
                  />

                  <select
                    name="passingYear"
                    value={formData.passingYear}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-gray-200
                      outline-none
                      focus:ring-2
                      focus:ring-emerald-500
                      disabled:bg-gray-50
                      disabled:text-gray-400
                    "
                  >
                    <option value="">
                      In Which Year You Passed Class 12?
                    </option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>

                  <input
                    type="number"
                    name="neetScore"
                    value={formData.neetScore}
                    min="0"
                    placeholder="NEET Score"
                    required
                    disabled={loading}
                    onKeyDown={(e) => {
                      // disable minus key
                      if (e.key === "-") {
                        e.preventDefault();
                      }
                    }}
                    onChange={handleChange}
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-gray-200
                      outline-none
                      focus:ring-2
                      focus:ring-emerald-500
                      disabled:bg-gray-50
                      disabled:text-gray-400
                      [&::-webkit-inner-spin-button]:appearance-none
                      [&::-webkit-outer-spin-button]:appearance-none
                    "
                  />

                  <select
                    name="neetYear"
                    value={formData.neetYear}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      outline-none
                      focus:ring-2
                      focus:ring-emerald-500
                      disabled:bg-gray-50
                      disabled:text-gray-400
                    "
                  >
                    <option value="">NEET Qualification Year?</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                    required
                    disabled={loading}
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-gray-200
                      outline-none
                      focus:ring-2
                      focus:ring-emerald-500
                      disabled:bg-gray-50
                      disabled:text-gray-400
                    "
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full
                      py-4
                      rounded-xl
                      font-bold
                      text-white
                      bg-gradient-to-r
                      from-emerald-600
                      to-orange-500
                      shadow-lg
                      hover:scale-[1.03]
                      transition
                      duration-300
                      cursor-pointer
                      flex
                      items-center
                      justify-center
                      gap-2
                      disabled:opacity-75
                      disabled:cursor-not-allowed
                    "
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
