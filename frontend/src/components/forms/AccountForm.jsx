import { updateUser } from "../../services/user"
import { useTimedNotification } from "../../contexts/NotificationContext"
import { Button } from "../ui/button"
;("use client")
import { useState, useEffect } from "react"
import { Input } from "../ui/input"
import { Slider } from "../ui/slider"
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps"
import { useUser } from "../../contexts/UserContext"
import axios from "axios"

const apiKey = "AIzaSyBIuxYntbgvhbbWzqmkL6wL5rXzMztc9Z4"

const AccountForm = () => {
  const { user } = useUser()
  const { setTimedNotification } = useTimedNotification()
  const [homeMarker, setHomeMarker] = useState(null)
  const [formState, setFormState] = useState({
    firstname: "",
    lastname: "",
    location: "",
    distancePreference: "",
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState({ ...formState, [name]: value })
  }
  useEffect(() => {
    if (user) {
      console.log(user)
      setFormState({ ...user })
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${user.location}&key=${apiKey}`
      console.log(url)
      axios.get(url).then((res) => {
        console.log(res.data.results[0].geometry.location)
        setHomeMarker(res.data.results[0].geometry.location)
      })
    }
  }, [user])

  const handleMapClick = (ev) => {
    setHomeMarker(ev.detail.latLng)
    console.log(ev.detail.latLng)
    const { lat, lng } = ev.detail.latLng
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    axios.get(url).then((res) => {
      const address = res.data.results[0].formatted_address
      const postalCode = address.match(/[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d/)[0]
      console.log(postalCode)
      setFormState({
        ...formState,
        location: postalCode,
      })
    })
    console.log(url)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("submitting form")
    console.log(formState)
    try {
      const updatedUser = await updateUser(formState)
      console.log("updated user", updatedUser)
      setTimedNotification("User updated successfully", "success", 3000)
    } catch (e) {
      console.error(e)
      setTimedNotification("Error updating user", "error", 3000)
    }
  }

  const handleSlider = (e) => {
    setFormState({ ...formState, distancePreference: e.target.value })
    console.log(e.target.value)
  }
  return (
    user && (
      <form className="w-60" onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="firstname">First Name:</label>
        <Input
          label="First Name"
          name="firstname"
          value={formState.firstname}
          onChange={handleChange}
          className={"mb-2"}
        />
        <label htmlFor="lastname">Last Name:</label>
        <Input
          label="Last Name"
          name="lastname"
          value={formState.lastname}
          onChange={handleChange}
          className={"mb-2"}
        />
        <label htmlFor="location">Location:</label>
        <Input
          label="Location"
          name="location"
          value={formState.location}
          onChange={handleChange}
          className={"mb-2"}
        />
        <label htmlFor="distancePreference">Distance Preference:</label>
        <div className="mb-2 w-15 h-8 bg-white rounded-md shadow-md border-1 border-gray-100 flex items-center">
          <p className="p-2">
            {formState.distancePreference || user.distancePreference}km
          </p>
        </div>
        {user?.distancePreference && (
          <Slider
            min={5}
            max={50}
            defaultValue={[user.distancePreference]}
            onChange={handleSlider}
            className="mb-2 cursor-pointer"
            name="distancePreference"
          />
        )}

        <Button type="submit" className="cursor-pointer">
          Update
        </Button>
        {homeMarker && (
          <APIProvider apiKey={"AIzaSyBIuxYntbgvhbbWzqmkL6wL5rXzMztc9Z4"}>
            <div className="h-96 w-96 relative">
              <Map
                className="h-96 w-96 relative z-0"
                defaultZoom={15}
                defaultCenter={homeMarker}
                mapId="ee2e17bdc42ea892"
                onCameraChanged={(ev) => {
                  console.log(
                    "camera changed:",
                    ev.detail.center,
                    "zoom:",
                    ev.detail.zoom,
                  )
                }}
                onClick={(ev) => handleMapClick(ev)}
              >
                <AdvancedMarker position={homeMarker}>
                  <Pin></Pin>
                </AdvancedMarker>
              </Map>
            </div>
          </APIProvider>
        )}
      </form>
    )
  )
}

export default AccountForm
