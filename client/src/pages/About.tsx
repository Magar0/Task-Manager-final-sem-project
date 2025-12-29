import React from "react";

const About = () => {
  return (
    <div className="flex h-screen w-full justify-center">
      <div className="mt-5 max-w-2xl p-6 text-center">
        <h1 className="mb-4 text-4xl font-bold">About Us</h1>
        <p className="mb-6 text-lg">
          Welcome to our application! We are dedicated to providing the best
          user experience with a focus on simplicity and functionality.
        </p>
        <p className="text-base text-gray-600">
          Our team is committed to continuous improvement and innovation. Thank
          you for being a part of our journey!
        </p>
      </div>
    </div>
  );
};

export default About;
