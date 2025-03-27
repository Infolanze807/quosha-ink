import React, { useState, useRef, FormEvent, ChangeEvent, useEffect } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
// import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
// import { FaPhoneAlt } from "react-icons/fa";

interface Data {
  name: string;
  phone_number: string;
  email: string;
  company_name: string;
}

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement | null>(null);
  const notifySuccess = () => toast.success("Submit Successfully");
  const notifyError = () => toast.error("Failed to Submit");

  const [formData, setFormData] = useState<Data>({
    name: "",
    phone_number: "",
    email: "",
    company_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Data>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (validateForm()) {
      emailjs
        .sendForm("service_8h9ul1j", "template_loksi7f", form.current as HTMLFormElement, {
          publicKey: "IxxacIMBqTuObR95u",
        })
        .then(
          () => {
            // console.log("SUCCESS!");
            setFormData({
              name: "",
              phone_number: "",
              email: "",
              company_name: "",
            });
            setErrors({});
            notifySuccess();
            setLoading(false);
          },
          (error) => {
            console.log("FAILED...", error.text);
            notifyError();
            setLoading(false);
          }
        );
    } else {
      // console.log("Form contains errors, cannot submit.");
      setLoading(false);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: Partial<Data> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    // Phone number validation
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Invalid phone number";
      valid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
      valid = false;
    }

    // Company name validation
    if (!formData.company_name.trim()) {
      newErrors.company_name = "Discription require..";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  return (
    <div className="py-16 pt-20 px-5">
      <div className="lg:px-40">
        <div className="center-title">
          <div className="lg:px-40 md:px-28 px-0">
            <div className="text-center text-4xl pb-10 font-semibold">
              Get in touch
            </div>
            <div className="flex items-center justify-center">
              {/* <div className="border rounded-md shadow-md bg-white p-10 py-16 text-center">
                <div className="bg-[--second-color] rounded-md p-7 w-max mx-auto">
                  <FaLocationDot className="text-3xl" />
                </div>
                <div className="text-2xl font-bold pt-5 pb-1">Visit office</div>
                <div className="text-xl font-semibold">
                  A-807, Empire Business Hub, Sola, Ahmedabad - 380060.
                </div>
              </div> */}
              {/* <div className="border rounded-md shadow-md bg-white p-10 py-16 text-center">
                <div className="bg-[--second-color] rounded-md p-7 w-max mx-auto">
                  <FaPhoneAlt className="text-3xl" />
                </div>
                <div className="text-2xl font-bold pt-5 pb-1">Call Us</div>
                <div className="text-xl font-semibold">+91 7016160435</div>
              </div> */}
              <div className="border rounded-md shadow-md bg-white p-10 py-16 text-center max-w-xl w-full">
                <div className="bg-[--second-color] rounded-md p-7 w-max mx-auto">
                  <MdEmail className="text-3xl" />
                </div>
                <div className="text-2xl font-bold pt-5 pb-1">Chat to us</div>
                <div className="text-xl font-semibold">
                  info@quoshaink.com
                </div>
                <div className="text-xl font-semibold">
                  quolabs@quoshaink.com
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
        <div className="relative shadow-md border-8 border-white mx-auto rounded-lg mt-20 mb-10 ">
          <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 items-center gap-5 lg:px-10 bg-slate-50 md:px-10 lg:py-16 md:py-16 py-10">
            <div className=" lg:px-10 px-5">
              <div className=" ps-1 font-semibold text-xl">Contact Us!</div>
              <div className="lg:text-6xl md:text-5xl text-5xl font-semibold pb-5">
                Our customer service team is waiting to{" "}
                <span className=" text-[--three-color]">Assist you.</span>
              </div>
              <div className="text-gray-800 font-bold text-2xl lg:pe-28">
                Want to get in touch? We'd love to hear from you. Here's how you
                can reach us...
              </div>
            </div>
            <div>
              <div>
                <form
                  ref={form}
                  onSubmit={handleSubmit}
                  className="mx-auto py-6 px-4"
                >
                  <div className="lg:flex md:flex ">
                    <div className="lg:pe-5 w-full md:pe-4 pt-5">
                      <label className="text-xl font-semibold">
                        Your Name *
                      </label>
                      <input
                        onChange={handleChangeInput}
                        value={formData.name}
                        name="name"
                        type="text"
                        placeholder="Enter Name"
                        className="w-full rounded-md h-12 px-6 bg-white text-xl lg:py-8 py-7 font-semibold outline-none border-none shadow-md"
                      />
                      {errors.name && (
                        <span className="text-red-500 text-xs">
                          {errors.name}
                        </span>
                      )}
                    </div>
                    <div className="pt-5 w-full">
                      <label className="text-xl font-semibold">
                        Your Number *
                      </label>
                      <input
                        onChange={handleChangeInput}
                        value={formData.phone_number}
                        name="phone_number"
                        type="phone"
                        placeholder="Enter Number"
                        className="w-full rounded-md h-12 px-6 bg-white text-xl lg:py-8 py-7 font-semibold outline-none border-none shadow-md"
                      />
                      {errors.phone_number && (
                        <span className="text-red-500 text-xs">
                          {errors.phone_number}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="pt-5">
                    <label className="text-xl font-semibold">
                      Your Email *
                    </label>
                    <input
                      onChange={handleChangeInput}
                      value={formData.email}
                      name="email"
                      type="email"
                      placeholder="Enter Email"
                      className="w-full rounded-md h-12 px-6 bg-white text-xl lg:py-8 py-7 font-semibold outline-none border-none shadow-md"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-xs">
                        {errors.email}
                      </span>
                    )}
                  </div>
                  <div className="pt-5">
                    <label className="text-xl font-semibold">
                      Please describe what you need *
                    </label>
                    <textarea
                      onChange={handleChangeInput}
                      value={formData.company_name}
                      name="company_name"
                    //   type="text"
                      placeholder="Type here..."
                      className="w-full rounded-md h-28 px-6 py-3 bg-white text-xl font-normal outline-none border-none shadow-md"
                    />
                    {errors.company_name && (
                      <span className="text-red-500 text-xs">
                        {errors.company_name}
                      </span>
                    )}
                  </div>

                  <div>
                    <button
                      className=" hover:text-[--three-color] text-white outline outline-2 outline-[--three-color] bg-[--three-color] hover:bg-white font-semibold rounded-md text-lg px-6 py-3 mt-4 block"
                      type="submit"
                      disabled={loading}
                    //   onClick={handleSubmit}
                    >
                      {loading ? "Sending..." : "Get Started"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
