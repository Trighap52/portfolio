import React, { useEffect } from "react";
import { FaLinkedin, FaGithub, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import fullpage from "fullpage.js";
import "fullpage.js/dist/fullpage.css"; // Import FullPage styles

const sections = [
  {
    id: "intro",
    title: "Hi 👋, I'm Zyad",
    content: (
      <>
        <h3 className="text-xl font-bold">
          Master's Student in Machine Learning
        </h3>
        <p className="mt-2 text-lg max-w-md text-justify">
          Pursuing a{" "}
          <span className="font-bold">double degree at KTH & INSA Lyon</span>,
          passionate about{" "}
          <span className="font-bold">AI, ML, Web Development, and DevOps</span>
          .
        </p>
        <a
          href="/Resume_Zyad_Haddad.pdf"
          download
          className="mt-4 inline-block bg-blue-500 px-4 py-2 rounded text-white font-bold"
        >
          📄 Download Resume
        </a>
      </>
    ),
  },
  {
    id: "education",
    title:""},
  {
    id: "rabat",
    title: "🌍 Rabat, Morocco ( - 2020)",
    content: (
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Morocco.svg/1280px-Flag_of_Morocco.svg.png"
            alt="Moroccan flag"
            className="mb-4 w-20 h-20 object-cover rounded-full"
          />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTImfDe-9ycM-5sU9IImtSgUIZWD1247rPfAyFptzYSUENyfetSvwhRvtNTD8ZDmQTgnnk&usqp=CAU"
            alt="High Tech Azzahra Logo"
            className="w-20 h-20 mb-4 rounded-full"
          />
        </div>
        <h3 className="text-xl font-bold">High Tech Azzahra School</h3>
        <p className="mt-2 text-lg max-w-md text-justify">
          High school years where I built a strong foundation in{" "}
          <span className="font-bold">Mathematics & Computer Science</span>.
        </p>
      </div>
    ),
  },
  {
    id: "nancy",
    title: "🏫 Nancy, France (2020 - 2022)",
    content: (
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/1280px-Flag_of_France.svg.png"
            alt="French flag"
            className="mb-4 w-20 h-20 object-cover rounded-full"
          />
          <img
            src="https://lycee-poincare.fr/wp-content/uploads/2022/11/cropped-Logo-e1670396402504.png"
            alt="Lycée Henri Poincaré Logo"
            className="w-20 h-20 mb-4 rounded-full bg-white"
          />
        </div>
        <h3 className="text-xl font-bold">Lycée Henri Poincaré</h3>
        <p className="mt-2 text-lg max-w-md">
          Studied in the <span className="font-bold">CPGE PC*</span> track,
          gaining a strong foundation in{" "}
          <span className="font-bold">Mathematics & Physics</span>.
        </p>
      </div>
    ),
  },
  {
    id: "lyon",
    title: "💻 Lyon, France (2022 - Present)",
    content: (
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/1280px-Flag_of_France.svg.png"
            alt="French flag"
            className="mb-4 w-20 h-20 object-cover rounded-full"
          />
          <img
            src="https://www.agera.asso.fr/app/uploads/2016/09/insa.jpg"
            alt="INSA Lyon Logo"
            className="w-20 h-20 mb-4 rounded-full"
          />
        </div>
        <h3 className="text-xl font-bold">INSA Lyon - Computer Science</h3>
        <p className="mt-2 text-lg max-w-md text-justify">
          Specializing in{" "}
          <span className="font-bold">
            Machine Learning, AI, and Web Development
          </span>
          .
        </p>
      </div>
    ),
  },
  {
    id: "stockholm",
    title: "🤖 Stockholm, Sweden (2024 - Present)",
    content: (
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/4/4c/Flag_of_Sweden.svg"
            alt="Swedish flag"
            className="mb-4 w-20 h-20 object-cover rounded-full"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/en/e/e0/KTH_Royal_Institute_of_Technology_logo.svg"
            alt="KTH Logo"
            className="w-20 h-20 mb-4 rounded-full"
          />
        </div>
        <h3 className="text-xl font-bold">
          KTH - Master's in Machine Learning
        </h3>
        <p className="mt-2 text-lg max-w-md text-justify">
          Exploring{" "}
          <span className="font-bold">
            Advanced AI, Differentiable Rendering, and Neural Networks
          </span>
          .
        </p>
      </div>
    ),
  },
  {
    id: "experience",
    title: "",
  },
  {
    id: "edf",
    title: "⚡️ EDF - Software Engineer Intern (2024 - 2025)",
    content: (
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/12/%C3%89lectricit%C3%A9_de_France_logo.svg"
            alt="EDF Logo"
            className="w-20 h-20 mb-4 rounded-full bg-white object-scale-down"
          />
        </div>
        <h3 className="text-xl font-bold">Software Engineer Intern</h3>
        <p className="mt-2 text-lg">
          Working on <span className="font-bold">Big Data solutions</span>, optimizing <span className="font-bold">machine learning pipelines</span> and handling <span className="font-bold">data engineering tasks</span>.
        </p>
      </div>
    ),
  },
  {
    id: "onepoint",
    title: "🔹 OnePoint - Frontend Developer (2024)",
    content: (
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Onepoint.png"
            alt="OnePoint Logo"
            className="w-20 h-20 mb-4 rounded-full bg-white object-scale-down"
          />
        </div>
        <h3 className="text-xl font-bold">Frontend Developer</h3>
        <p className="mt-2 text-lg">
          Developed <span className="font-bold">React & UI/UX components</span>, collaborating with <span className="font-bold">design teams</span> to improve <span className="font-bold">user experience</span>.
        </p>
      </div>
    ),
  },
  {
    id: "volvo",
    title: "🚚 Volvo IT - Data Trainee (2023)",
    content: (
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Volvo-Spread-Word-Mark-Black.svg"
            alt="Volvo Logo"
            className="w-20 h-20 mb-4 rounded-full bg-white object-scale-down"
          />
        </div>
        <h3 className="text-xl font-bold">Data Trainee</h3>
        <p className="mt-2 text-lg max-w-md text-justify"> 
          Worked on <span className="font-bold">data analytics & Python automation</span>, optimizing <span className="font-bold">business insights</span> for the company.
        </p>
      </div>
    ),
  },
  {
    id: "skills",
    title: "🛠 Tech Stack & Skills",
    content: (
      <>
        <p>
          Proficient in{" "}
          <span className="font-bold">
            Python, C++, C, Java, JavaScript, and TypeScript
          </span>
          .
        </p>
        <p>
          Experienced with{" "}
          <span className="font-bold">
            PyTorch, OpenGL, TensorFlow, PostgreSQL, React, and Angular
          </span>
          .
        </p>
        <a
          href="https://github.com/Trighap52"
          target="_blank"
          className="mt-4 inline-block bg-gray-800 px-4 py-2 rounded text-white font-bold"
        >
          🔗 View My GitHub
        </a>
      </>
    ),
  },
  {
    id: "contact",
    title: "📫 Connect with Me",
    content: (
      <div className="flex space-x-4 mt-4">
        <a href="https://www.linkedin.com/in/zyad-haddad/" target="_blank">
          <FaLinkedin className="text-blue-500 text-3xl" />
        </a>
        <a href="https://github.com/zyad-haddad" target="_blank">
          <FaGithub className="text-gray-500 text-3xl" />
        </a>
        <a href="mailto:trighap52@gmail.com">
          <FaEnvelope className="text-red-500 text-3xl" />
        </a>
        <a href="https://wa.me/+33619342962">
          <FaWhatsapp className="text-green-500 text-3xl" />
        </a>
      </div>
    ),
  },
];

const Sections = () => {
  useEffect(() => {
    new fullpage("#fullpage", {
      autoScrolling: true,
      navigation: true,
      scrollingSpeed: 1000, // Smooth transition between pages
    });
  }, []);

  return (
    <div id="fullpage">
      {sections.map(({ id, title, content }) => (
        <div
          key={id}
          className="section"
          style={{ fontFamily: "Exo, sans-serif" }}
        >
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          {content}
        </div>
      ))}
    </div>
  );
};

export default Sections;
