import React, { useState, useEffect } from 'react'

const HotelResultDisplay: React.FC<{ hotelResults: HotelResult[] }> = ({ hotelResults }) => (
  <div>
    {hotelResults.map((result, resultIndex) =>
      result.hotels.map((hotel, hotelIndex) => (
        <a
          key={`${resultIndex}-${hotelIndex}`}
          href={`https://www.google.com/search?q=${encodeURIComponent(hotel.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block border rounded-lg p-4 mb-4 shadow-md text-blue-600 hover:underline"
        >
          <h3 className="font-bold text-lg mb-4">{hotel.name}</h3>

          <div className="flex items-center space-x-4">
            {/* Hotel Image */}
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-32 h-32 object-cover rounded-md"
            />

            {/* Hotel Details */}
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                <strong>Price:</strong> ${hotel.price}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Rating:</strong> {hotel.rating} stars
              </p>
              <p className="text-sm text-gray-600">
                <strong>Description:</strong> {hotel.description}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Amenities:</strong> {hotel.amenities.join(", ")}
              </p>
            </div>
          </div>
        </a>
      ))
    )}
  </div>
);



const FlightResultDisplay: React.FC<{ flightResults: FlightResult[] }> = ({ flightResults }) => (
  <div>
    {flightResults.map((result, resultIndex) => (
      <div key={resultIndex} className="border rounded-lg p-4 space-y-6 shadow-md">
        <div className="flex items-center space-x-4">
          <img
            src={result.airline_logo}
            alt={`Logo of ${result.flights[0]?.airline || 'Airline'}`}
            className="w-16 h-16 object-contain"
          />
          <div>
            <h3 className="font-bold text-lg">{result.type} Flight</h3>
            <p className="text-gray-600">Price: ${result.price}</p>
            <p className="text-gray-600">Total Duration: {result.total_duration} minutes</p>
          </div>
        </div>
        <div className="space-y-4">
          {result.flights.map((flight, flightIndex) => (
            <div key={flightIndex} className="border rounded-lg p-4 flex items-center">
              <div className="flex-1">
                <h4 className="font-bold text-md">{flight.airline}</h4>
                <p className="text-sm">
                  <strong>Departure:</strong> {flight.departure_airport.name} at{' '}
                  {flight.departure_airport.time}
                </p>
                <p className="text-sm">
                  <strong>Arrival:</strong> {flight.arrival_airport.name} at{' '}
                  {flight.arrival_airport.time}
                </p>
                <p className="text-sm">
                  <strong>Duration:</strong> {flight.duration} minutes
                </p>
                <p className="text-sm">
                  <strong>Class:</strong> {flight.travel_class}
                </p>
              </div>
              <img
                src={flight.airline_logo}
                alt={flight.airline}
                className="w-12 h-12 object-contain ml-4"
              />
            </div>
          ))}
        </div>
        {result.layovers && result.layovers.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-bold">Layovers</h4>
            {result.layovers.map((layover, layoverIndex) => (
              <p key={layoverIndex} className="text-sm">
                <strong>{layover.name}</strong> - {layover.duration} minutes
              </p>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);



interface Flight {
  departure_airport: {
    name: string;
    id: string;
    time: string;
  };
  arrival_airport: {
    name: string;
    id: string;
    time: string;
  };
  duration: number;
  airplane: string;
  airline: string;
  airline_logo: string;
  travel_class: string;
  flight_number: string;
  legroom: string;
  extensions: string[];
}

interface Layover {
  duration: number;
  name: string;
  id: string;
}

interface FlightResult {
  flights: Flight[];
  layovers?: Layover[];
  total_duration: number;
  price: number;
  type: string;
  airline_logo: string;
  extensions: string[];
}

interface Hotel {
  name: string;
  price: number;
  rating: number;
  description: string;
  amenities: string[];
  image: string;
}

interface HotelResult {
  hotels: Hotel[];
}

interface Message {
  text?: string;
  sender: 'user' | 'assistant';
  flights?: FlightResult[];
  hotels?: HotelResult[];
}


function mapFlightDataToFlightResults(flightDataArray: any[]): FlightResult[] {
  if (!flightDataArray || flightDataArray.length === 0) {
    return [];
  }

  return flightDataArray.map((offer: any) => ({
    flights: offer.flights.map((flight: any) => ({
      departure_airport: {
        name: flight.departure_airport?.name || "",
        id: flight.departure_airport?.id || "",
        time: flight.departure_airport?.time || "",
      },
      arrival_airport: {
        name: flight.arrival_airport?.name || "",
        id: flight.arrival_airport?.id || "",
        time: flight.arrival_airport?.time || "",
      },
      duration: flight.duration || 0,
      airplane: flight.airplane || "",
      airline: flight.airline || "",
      airline_logo: flight.airline_logo || "",
      travel_class: flight.travel_class || "",
      flight_number: flight.flight_number || "",
      legroom: flight.legroom || "",
      extensions: flight.extensions || [],
    })),
    layovers: (offer.layovers || []).map((layover: any) => ({
      duration: layover.duration || 0,
      name: layover.name || "",
      id: layover.id || "",
    })),
    total_duration: offer.total_duration || 0,
    price: offer.price || 0,
    type: offer.type || "",
    airline_logo: offer.airline_logo || "",
    extensions: offer.extensions || [],
  }));
}

function mapHotelDataToHotelResults(hotelDataArray: any[]): HotelResult[] {
  if (!hotelDataArray || hotelDataArray.length === 0) {
    return [];
  }

  return hotelDataArray.map((hotel: any) => ({
    hotels: [{
    name: hotel.name || '',
    price: hotel.rate_per_night && hotel.rate_per_night['lowest'] ? hotel.rate_per_night['lowest'] : 0,
    rating: hotel.overall_rating || 0,
    description: hotel.description || '',
    amenities: hotel.amenities || [],
    image: hotel.images[0]['original_image'] || '',
  }],
  }));
}



function AITravelAgency() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your travel assistant. How can I help you today?", sender: 'assistant' }
  ])
  const [input, setInput] = useState('')
  const [isAssistantTyping, setIsAssistantTyping] = useState(false)


  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      setIsAssistantTyping(true);
  
      try {
        const response = await fetch('http://0.0.0.0:8000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_input: input,
            thread_id: "1", // You might want to dynamically set this
          }),
        });
  
        const data = await response.json();
  
        if (data.response_type === "message") {
          setMessages((prev) => [...prev, { text: data.response, sender: 'assistant' }]);
        } else if (data.response_type === "flights") {
          const flightDataArray = JSON.parse(data.response);
  
          if (Array.isArray(flightDataArray)) {
            const mappedFlightResults = mapFlightDataToFlightResults(flightDataArray);
            setMessages((prev) => [...prev, { sender: 'assistant', flights: mappedFlightResults }]);
          } else {
            console.error("Unexpected flight data format:", flightDataArray);
          }
        } else if (data.response_type === "hotels") {
          const hotelDataArray = JSON.parse(data.response);
  
          if (Array.isArray(hotelDataArray)) {
            const mappedHotelResults = mapHotelDataToHotelResults(hotelDataArray);
            setMessages((prev) => [...prev, { sender: 'assistant', hotels: mappedHotelResults }]);
          } else {
            console.error("Unexpected hotel data format:", hotelDataArray);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessages((prev) => [...prev, { text: "Sorry, there was an error processing your request.", sender: 'assistant' }]);
      } finally {
        setIsAssistantTyping(false);
      }
    }
  };
  
  

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
      {messages.map((message, index) => (
  <div key={index} className={`flex ${message.sender === 'assistant' ? 'justify-start' : 'justify-end'}`}>
    <div className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'assistant' ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
      {message.text && <p>{message.text}</p>}
      {message.hotels && <HotelResultDisplay hotelResults={message.hotels} />}
      {message.flights && <FlightResultDisplay flightResults={message.flights} />}

    </div>
  </div>
))}

        
        {isAssistantTyping && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-3 rounded-lg bg-gray-200">
              <LoadingDots />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <button onClick={handleSend} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Send</button>
      </div>
    </div>
  )
}

function LoadingDots() {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  )
}

export default AITravelAgency