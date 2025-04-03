import LandingForm from "../components/forms/LandingForm"
import NotificationBadge from "../components/NotificationBadge"
import backgroundImage from "../assets/background_2.png"
import laptopImage from "../assets/laptop.png"
import bookboardLogo from "../assets/bookboard.png"

const columnStyling =
  "p-4 bg-white h-screen col-span-1 flex flex-col items-center"

const LandingPage = () => {
  return (
    <div className="grid grid-cols-2">
      <div className={`${columnStyling} relative`}>
        <img
          src={bookboardLogo}
          alt=""
          className="h-10 absolute top-5 left-5"
        />
        <div className="mt-40 flex flex-col items-center">
          <LandingForm />
          <NotificationBadge />
        </div>
      </div>
      <div className="col-span-1 relative h-screen overflow-hidden flex flex-col items-center">
        {/* Background Image */}
        <img
          src={backgroundImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Floating Image */}
        <div className="absolute mt-50 z-10 flex flex-col items-center w-8/10">
          <img src={laptopImage} alt="Laptop" />
          <p className="text-center text-2xl mt-4 w-9/10 font-secondary bg-white/80 rounded-md py-2">
            Save time and money exchanging books and board games.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
