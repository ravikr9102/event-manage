import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import eventsData from "../sportsDayData.json";
import { motion } from "framer-motion";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { toast, Toaster } from "react-hot-toast";

const Events = () => {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSelectEvent = (event) => {
    if (selectedEvents.length >= 3) {
      toast.error("You can only select up to 3 events.");
      return;
    }

    const isConflict = selectedEvents.some((selected) =>
      isTimeConflict(selected, event)
    );

    if (isConflict) {
      toast.error(
        "This event overlaps with one you've already selected. Please choose another.."
      );
      return;
    }
    setSelectedEvents([...selectedEvents, event]);
    setIsSheetOpen(true);
    toast.success("Event selected successfully!");
  };

  const handleDeselectEvent = (eventId) => {
    const updatedEvents = selectedEvents.filter(
      (event) => event.eventId !== eventId
    );
    setSelectedEvents(updatedEvents);
    localStorage.setItem("selectedEvents", JSON.stringify(updatedEvents));
    toast.success("Event removed successfully!");
  };

  const handleClick = () => {
    setIsSheetOpen(true);
  };

  const isTimeConflict = (event1, event2) => {
    return (
      event1.startTime < event2.endTime && event1.endTime > event2.startTime
    );
  };

  useEffect(() => {
    const storedEvents = localStorage.getItem("selectedEvents");
    if (storedEvents) {
      setSelectedEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    if (selectedEvents.length > 0) {
      localStorage.setItem("selectedEvents", JSON.stringify(selectedEvents));
    }
  }, [selectedEvents]);

  return (
    <div className="p-12">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-between items-center my-6">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-wide border-b-2 border-gray-300">
          All Events
        </h2>
        <h3
          onClick={handleClick}
          className="text-2xl font-semibold text-gray-800 tracking-wide border-b-2 border-gray-300 ml-5 cursor-pointer"
        >
          Selected Event
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 tracking-wide">
        {eventsData.events.map((event) => (
          <motion.div
            key={event.eventId}
            animate={{ scale: 1.05 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-fit object-cover object-center"
            />
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{event.category}</p>
              <p className="text-gray-800 text-base mb-4">
                {event.startTime} - {event.endTime}
              </p>
              <Button
                onClick={() => handleSelectEvent(event)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
              >
                Select Event
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      <Sheet open={isSheetOpen} onOpenChange={(open) => setIsSheetOpen(open)}>
        <SheetContent side="right">
          <h3 className="tracking-wide text-xl text-gray-700 font-medium">
            Selected Events
          </h3>
          <div className="p-3 tracking-wide">
            {selectedEvents.length > 0 ? (
              selectedEvents.map((event) => (
                <div key={event.eventId} className="my-3">
                  <h3 className="text-xl font-bold mb-2">
                    {event.name}{" "}
                    <span className="text-base font-normal ml-2">
                      ({event.category})
                    </span>
                  </h3>
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-20 object-cover object-center"
                  />
                  <p className="text-gray-800 text-base mt-2">
                    {event.startTime} - {event.endTime}
                  </p>
                  <button
                    onClick={() => handleDeselectEvent(event.eventId)}
                    className="bg-red-500 text-sm text-white py-1.5 px-2 rounded hover:bg-red-600 transition duration-300"
                  >
                    Remove Event
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-800">No events selected</p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Events;
