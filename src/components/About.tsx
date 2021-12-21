const About = () => {
  return (
      <footer className="absolute text-white z-1 bottom-0 right-0 pb-3">
      <div className="text-center block text-lg font-bold">
        <a href="https://www.evrenbal.com/">Evren BAL</a>
      </div>
      <div className="flex justify-center text-3xl">
        <a title="Contact me on twitter!"
          href="https://www.twitter.com/benevrenbal"
          target="_blank"
          rel="noreferrer"
          className="mx-2"
        >
          <i className="fa fa-twitter"></i>
        </a>
        <a title="Contact me on LinkedIn!"
          href="https://www.linkedin.com/in/benevrenbal"
          target="_blank"
          rel="noreferrer"
          className="mx-2"
          >
          <i className="fa fa-linkedin"></i>
        </a>
        <a title="Check my Github Account!"
          href="https://www.github.com/evrenbal"
          target="_blank"
          rel="noreferrer"
          className="mx-2"
          >
          <i className="fa fa-github"></i>
        </a>
      </div>        
    </footer>
  )
}

export default About;

