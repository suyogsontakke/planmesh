import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { Itinerary, TripFormData } from "../types";

const apiKey = process.env.API_KEY || '';

// Define the response schema for structured output
const itinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    destinationName: { type: Type.STRING, description: "Official name of the destination" },
    coordinates: {
      type: Type.OBJECT,
      properties: {
        lat: { type: Type.NUMBER, description: "Latitude of the destination city center" },
        lng: { type: Type.NUMBER, description: "Longitude of the destination city center" },
      },
      required: ["lat", "lng"]
    },
    originCoordinates: {
      type: Type.OBJECT,
      properties: {
        lat: { type: Type.NUMBER, description: "Latitude of the origin city" },
        lng: { type: Type.NUMBER, description: "Longitude of the origin city" },
      },
      required: ["lat", "lng"]
    },
    durationDays: { type: Type.INTEGER },
    totalEstimatedCost: { type: Type.STRING, description: "Total estimated cost in both Origin and Destination currencies (e.g. $2000 USD / ¥300,000 JPY)" },
    currency: { type: Type.STRING, description: "Local currency code (e.g. JPY)" },
    exchangeRateInfo: { type: Type.STRING, description: "Approximate exchange rate string (e.g. 1 USD ≈ 150 JPY)" },
    overview: { type: Type.STRING, description: "A catchy, exciting 2-sentence overview of the trip." },
    precautions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-5 safety precautions or cultural etiquette tips specific to the destination."
    },
    secretTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 highly confidential 'hidden gems' or hacks for this place that tourists usually miss."
    },
    youtubeSearchTerms: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 specific search queries to find the best travel guides on YouTube for this trip."
    },
    bookingSuggestions: {
      type: Type.OBJECT,
      properties: {
        hotelArea: { type: Type.STRING, description: "Best neighborhood to book a hotel in based on the vibe." },
        transportType: { type: Type.STRING, description: "Recommended vehicle to rent or booking advice (e.g. 'Rent a Scooty' or 'Use Uber exclusively')." }
      },
      required: ["hotelArea", "transportType"]
    },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          dailyQuote: { type: Type.STRING, description: "A humorous, short motivational quote for the day. MUST be a mix of English, Hindi, and Hinglish slang (e.g. 'Subah ho gayi mamu, let's explore!')." },
          theme: { type: Type.STRING, description: "A short theme for the day (e.g. Historical Dive)" },
          summary: { type: Type.STRING, description: "One sentence summary of the day" },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, description: "Time of day (e.g. Morning, 10:00 AM)" },
                title: { type: Type.STRING, description: "Name of the activity" },
                description: { type: Type.STRING, description: "2 sentence description of what to do" },
                location: { type: Type.STRING, description: "Specific place name" },
                estimatedCost: { type: Type.STRING, description: "Estimated cost in Local Currency" }
              },
              required: ["time", "title", "description"]
            }
          }
        },
        required: ["dayNumber", "theme", "activities", "summary", "dailyQuote"]
      }
    },
    packingTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 5 essential items to pack for this specific trip."
    }
  },
  required: ["destinationName", "coordinates", "originCoordinates", "durationDays", "totalEstimatedCost", "days", "overview", "packingTips", "precautions", "youtubeSearchTerms", "exchangeRateInfo", "secretTips", "bookingSuggestions"]
};

export const generateItinerary = async (formData: TripFormData): Promise<Itinerary> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Create a market-ready, Gen-Z style travel itinerary.
    
    Travel Details:
    - Origin: ${formData.origin}
    - Destination: ${formData.destination}
    - Travelers: ${formData.travelers}
    - Budget Level: ${formData.budget}
    - Travel Styles: ${formData.style.join(", ")}
    - Primary Transport Mode: ${formData.transportMode}
    
    Requirements:
    1. Coordinates: Provide exact coordinates for mapping.
    2. Costs: Estimate in both Origin and Destination currency.
    3. Vibe: The tone should be fun, energetic, and helpful.
    4. **Daily Quotes**: For each day, generate a humorous quote. It MUST be in **Hinglish** (mixture of Hindi and English) or just funny English slang. Examples: "Bhai paisa vasool day today", "Kal diet start karenge, aaj kha lo", "Leg day skip mat karna, lots of walking".
    5. **Secret Tips**: Provide "Hidden Gems" that aren't on standard tourist lists.
    6. **Booking Help**: Suggest specifically *where* to stay (neighborhood) and *what* to drive/ride based on the user's transport choice (${formData.transportMode}).
    7. **Transport Logic**: Since the user chose ${formData.transportMode}, ensure the activity flow makes sense for that vehicle (e.g., if "Walk", keep things close; if "Car", can go further).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.5, // Slightly higher for humor
      },
    });

    if (!response.text) {
      throw new Error("No content generated from Gemini.");
    }

    const data = JSON.parse(response.text) as Itinerary;
    
    // Manually attach the transport mode from the request so it persists
    data.transportMode = formData.transportMode;
    
    return data;

  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};

export const generateProfileImage = async (prompt: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Generate a cool, stylized profile picture avatar. Style: ${prompt}. High quality, artistic, centered face.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating profile image:", error);
    throw error;
  }
};