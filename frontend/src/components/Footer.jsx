import NotificationBanner from "./NotificationBanner"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <div>
      <div className="h-24 font-bold w-full bg-rose-400 text-white text-center flex flex-col items-center justify-center">
        <p>
          Please note this website is in active development and is{" "}
          <span>only intended for experimentation.</span>
        </p>
        <p className="text-sm font-normal">
          Many features are purely for aesthetic/layout purposes and are not yet
          implemented.
        </p>
        <p className="text-sm font-normal">
          To view a list of features that are working, as well as those that are
          being worked on, please visit:
        </p>

        <p className="font-bold">
          <a
            href="https://github.com/brendanml/bookboard"
            className="hover:underline"
          >
            https://github.com/brendanml/bookboard
          </a>
        </p>
      </div>
      <footer className="bg-black text-white text-center p-4 w-full h-16 left-0 bottom-0">
        <p className="text-sm">&copy; Brendan Lynch, 2025</p>
      </footer>
    </div>
  )
}
export default Footer
