import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import Button from '../components/Button';
import InputField from '../components/InputField';
import ReviewCard from '../components/ReviewCard'; // Import the ReviewCard component

const LandingPage: React.FC = () => {
  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-gray-900 text-white">
        <div className="text-2xl font-bold">
          <img src="/logo.png" alt="Company Logo" className="inline-block mr-2 w-8" />
          MyCompany
        </div>
        <div className="space-x-6">
          <a href="#about" className="hover:text-gray-300">About</a>
          <a href="#demo" className="hover:text-gray-300">Demo</a>
          <a href="#signin" className="hover:text-gray-300">Sign In</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex items-center justify-between p-10 bg-gray-100">
        <div className="w-1/2">
          <h1 className="text-4xl font-bold mb-4">Revolutionize Your Design Process</h1>
          <p className="text-lg text-gray-600">
            Track design performance with actionable insights. Elevate creativity with data-driven feedback.
          </p>
        </div>
        <div className="w-1/2">
          <img src="/images/Hero.avif" alt="Hero" className="rounded-md shadow-lg" />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="flex p-10">
        <div className="w-7/12">
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/f6k3W3Q9-8Q?autoplay=1&mute=1&loop=1&playlist=f6k3W3Q9-8Q"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="rounded-md shadow-lg"
          ></iframe>
        </div>
        <div className="w-5/12 pl-10">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600">
            Analyze feedback in real-time, refine your design approach, and drive better outcomes.
          </p>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="p-10 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-6">What Our Customers Say</h2>
        <div className="flex space-x-6 overflow-x-auto"> {/* Allow horizontal scroll */}
          <ReviewCard 
            imageSrc="/images/user.png" // Replace with actual image path
            reviewText="This tool has transformed how we design and iterate!" 
            reviewerName="Jane Doe" 
            rating={5} // Set rating for Jane Doe
          />
          <ReviewCard 
            imageSrc="/images/user.png" // Replace with actual image path
            reviewText="Our design process is now more efficient and data-driven." 
            reviewerName="John Smith" 
            rating={4} // Set rating for John Smith
          />
          <ReviewCard 
            imageSrc="/images/user.png" // Replace with actual image path
            reviewText="An excellent resource for anyone looking to improve their design workflow." 
            reviewerName="Mark Twain" 
            rating={5} // Set rating for Mark Twain
          />
          <ReviewCard 
            imageSrc="/images/user.png" // Replace with actual image path
            reviewText="The insights provided are invaluable!" 
            reviewerName="Susan Lee" 
            rating={5} // Set rating for Susan Lee
          />
        </div>
      </section>

      {/* Why Use Our Product */}
      <section className="p-10">
        <h2 className="text-2xl font-bold mb-4">Why Use Our Product?</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Data-driven design feedback</li>
          <li>Real-time analytics and insights</li>
          <li>Improve design collaboration and outcomes</li>
        </ul>
      </section>

      {/* Book Demo */}
      <section className="p-10 bg-blue-100 flex justify-center">
        <div className="w-4/5 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Book a Demo</h2>
          <p className="text-gray-600 mb-4">
            Experience the power of our product firsthand. Schedule a demo today!
          </p>
          <Button text="Book Now" onClick={() => alert('Demo Booked!')} />
        </div>
      </section>

      {/* Trusted by Companies */}
      <section className="p-10 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-6">Trusted by Top Companies</h2>
        <div className="flex justify-around space-x-4">
          <span className="bg-white p-2 rounded shadow">Company A</span>
          <span className="bg-white p-2 rounded shadow">Company B</span>
          <span className="bg-white p-2 rounded shadow">Company C</span>
        </div>
      </section>

      {/* Contact Section */}
      <section className="flex p-10">
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">Contact Our Team</h2>
          <p className="text-gray-600">
            Have questions or need help? Reach out to our team, and we'll assist you.
          </p>
        </div>
        <div className="w-1/2">
          <form className="space-y-4">
            <InputField label="Name" value="" onChange={() => {}} />
            <InputField label="Email" value="" onChange={() => {}} type="email" />
            <InputField label="Message" value="" onChange={() => {}} type="textarea" />
            <Button text="Submit" onClick={() => alert('Message Sent!')} />
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white p-6">
        <div className="flex justify-around">
          <div>
            <h3 className="font-bold">Contact</h3>
            <p>Email: support@company.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
          <div>
            <h3 className="font-bold">Services</h3>
            <ul className="space-y-1">
              <li>Design Analytics</li>
              <li>Feedback Tracking</li>
              <li>Performance Insights</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4">
          <FaFacebook className="inline-block mx-2" />
          <FaTwitter className="inline-block mx-2" />
          <FaLinkedin className="inline-block mx-2" />
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
