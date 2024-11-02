import React, { useEffect, useState } from "react";

const pigeonFacts = [
  "Pigeons can see ultraviolet light, which humans cannot perceive.",
  "A pigeon can fly at speeds of up to 77 mph (124 km/h).",
  "Pigeons have been domesticated for thousands of years.",
  "The homing ability of pigeons is thought to rely on the Earth’s magnetic fields.",
  "Pigeons can recognize their reflection in mirrors.",
  "A pigeon can make over 100 different sounds.",
  "Pigeons have excellent navigational skills and can return home from over 1,000 miles away.",
  "Pigeons mate for life and are known to be monogamous.",
  "Pigeons can adapt to a wide range of habitats, including urban environments.",
  "Pigeons have a unique foot structure that helps them walk and perch.",
  "Pigeon chicks are called squabs.",
  "Pigeons primarily eat seeds, fruits, and vegetables.",
  "Pigeons have a highly developed sense of smell.",
  "The average lifespan of a pigeon in the wild is about 3 to 5 years.",
  "In captivity, pigeons can live for over 15 years.",
  "Pigeons have a very strong sense of direction and can find their way home even after being transported far away.",
  "The record for the longest pigeon flight is over 7,000 miles.",
  "Pigeons have been used in military communications due to their homing ability.",
  "The rock pigeon is the ancestor of most domestic pigeon breeds.",
  "Pigeons can recognize human faces and remember them for years.",
  "Pigeons have a unique way of communicating with each other using body language.",
  "Some pigeons can fly higher than 6,000 feet.",
  "Pigeons can hear low-frequency sounds that humans cannot detect.",
  "The world’s largest pigeon was a racing pigeon that weighed 2.5 pounds.",
  "Pigeons have been kept as pets for centuries.",
  "Pigeons can recognize and remember over 1,000 different images.",
  "Pigeons are known to play with objects and engage in playful behavior.",
  "Pigeons have been used in scientific research, particularly in studies on navigation.",
  "Pigeons have a special muscle that allows them to rotate their heads 180 degrees.",
  "Pigeons can see colors that humans cannot, making their vision very unique.",
  "In ancient Egypt, pigeons were revered as sacred animals.",
  "Pigeons have a special gland near their eyes that helps them produce tears.",
  "Pigeons are highly social animals that live in flocks.",
  "Pigeons can eat small pieces of bread, but it’s not very nutritious for them.",
  "Pigeons can be trained to deliver messages to specific locations.",
  "Pigeons have a strong bond with their mates and can often be seen preening each other.",
  "Pigeons can recognize themselves in photographs.",
  "Pigeons have a unique cooing sound that they use to attract mates.",
  "Pigeons can fly at altitudes of up to 10,000 feet.",
  "Some pigeon breeds are known for their unique feather patterns and colors.",
  "Pigeons have a high metabolic rate, allowing them to fly long distances.",
  "Pigeons are often used in racing competitions, with some fetching high prices.",
  "Pigeons have a distinctive walking style that involves bobbing their heads.",
  "Pigeons can see polarized light, which helps them navigate.",
  "In Japan, pigeons are often featured in art and literature.",
  "Pigeons have been found to exhibit signs of empathy towards each other.",
  "Pigeons are capable of learning simple tasks and solving problems.",
  "The world record for the longest pigeon flight was set by a pigeon named 'Cher Ami'.",
  "Pigeons have been used as therapy animals in some contexts.",
  "Pigeons are often kept in lofts or aviaries by hobbyists.",
  "Some pigeons can live in extreme weather conditions, including heat and cold.",
  "Pigeons can communicate their location to each other using specific calls.",
  "Pigeons can differentiate between human voices and can remember them.",
  "Pigeons are sometimes used in search and rescue operations due to their homing ability.",
  "Pigeons have been shown to have good long-term memory.",
  "Pigeons are capable of recognizing and remembering symbols.",
  "Some pigeon breeds have unique abilities, such as flying backwards.",
  "Pigeons can fly for hours without stopping, covering vast distances.",
  "The domestication of pigeons dates back over 5,000 years.",
  "Pigeons can live in cities and adapt to urban life quite well.",
  "Pigeons are known for their strong homing instincts, which help them find their way back to their nests.",
  "Pigeons can use landmarks to navigate their surroundings.",
  "In some cultures, pigeons are considered symbols of peace.",
  "Pigeons can consume a wide variety of foods, including grains, fruits, and vegetables.",
  "Pigeons are often seen in parks and public spaces, where they have become accustomed to human presence.",
  "The study of pigeons has contributed significantly to our understanding of animal behavior.",
  "Pigeons can learn to associate specific sounds with food rewards.",
  "Some pigeon breeds are specifically bred for their flying abilities and endurance.",
  "Pigeons are known for their strong attachment to their nesting sites.",
  "Pigeons have been involved in various cultural practices, including racing and exhibitions.",
  "Pigeons can detect changes in weather and atmospheric pressure.",
  "Pigeons are often used in photography as subjects due to their unique appearance.",
  "Pigeons can often be found in groups, foraging for food together.",
  "Pigeons have a unique feather structure that helps them maintain their flight.",
  "Pigeons are known to be very adaptable animals.",
  "Some pigeons are trained to participate in competitions and exhibitions.",
  "Pigeons can be recognized by their distinctive cooing sounds.",
  "The average pigeon can consume around 30 grams of food per day.",
  "Pigeons have been a source of inspiration for artists and poets throughout history.",
  "In some cultures, pigeons are released during ceremonies as a symbol of peace and hope.",
  "Pigeons have been known to exhibit migratory behavior in search of food.",
  "Pigeons have a complex social structure within their flocks.",
  "Some pigeons have unique coloration patterns that make them easily identifiable.",
  "Pigeons can be found on every continent except Antarctica.",
  "The study of pigeon behavior has led to advancements in the field of ethology.",
  "Pigeons have been shown to possess a form of problem-solving ability.",
  "Pigeons can live comfortably in a variety of environments, from rural areas to cities.",
  "Pigeons have a unique way of preening their feathers to keep them clean and waterproof.",
  "Pigeons have strong social bonds with their flock members.",
  "The world's most expensive racing pigeon sold for over $1.9 million.",
  "Pigeons can be trained to recognize colors and shapes.",
  "Pigeons are often used in educational settings to teach students about animal behavior.",
  "Pigeons have a unique way of expressing emotions through body language.",
  "Some pigeons have been trained to perform tricks for entertainment.",
  "Pigeons can easily adapt their diets based on food availability.",
  "The majority of domesticated pigeons are derived from the rock pigeon species.",
  "Pigeons can communicate distress signals to alert others of danger.",
  "Some pigeon breeds are known for their unique vocalizations.",
  "Pigeons have been featured in numerous films and television shows.",
  "Pigeons are sometimes kept as therapy animals for emotional support.",
  "Pigeons have a special layer of tissue in their eyes that helps them see clearly while flying.",
  "Pigeons can detect odors from up to a mile away.",
  "Some pigeon breeds are prized for their beauty and are shown in competitions.",
  "Pigeons are known to exhibit playful behavior, such as chasing each other.",
  "The average pigeon can consume around 1 to 2 cups of food per day.",
  "Pigeons have a unique way of vocalizing that varies between different breeds.",
  "Pigeons are often seen as pests in urban areas due to their large populations.",
  "Pigeons have a unique digestive system that allows them to process a wide variety of foods.",
  "The study of pigeons has contributed to advancements in navigation technology.",
  "Pigeons can be trained to find specific locations and return to their owners.",
  "Pigeons are known for their ability to adapt to changing environments.",
  "Some pigeons are bred for their intelligence and problem-solving skills.",
  "Pigeons can be found in a variety of habitats, from forests to deserts.",
  "Pigeons have a unique wing structure that allows them to fly efficiently.",
  "The average pigeon can fly for up to 12 hours without stopping.",
  "Pigeons can recognize their caretakers and show signs of affection.",
  "Pigeons have a highly developed sense of taste.",
  "Some pigeon breeds are known for their impressive flying abilities.",
  "Pigeons have been shown to exhibit signs of creativity in problem-solving tasks.",
  "Pigeons are often seen as symbols of love and fidelity.",
  "Pigeons can recognize and respond to their names when called.",
];

const PigeonFactsRandom: React.FC = () => {
  const [popups, setPopups] = useState<
    { id: number; fact: string; x: number; y: number }[]
  >([]);
  const [popupId, setPopupId] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pigeonFacts.length);
      const newPopup = {
        id: popupId,
        fact: pigeonFacts[randomIndex],
        x: Math.random() * window.innerWidth, // Random x position
        y: Math.random() * window.innerHeight, // Random y position
      };
      setPopups((prevPopups) => [...prevPopups, newPopup]);
      setPopupId((prevId) => prevId + 1); // Increment the popup ID
    }, 100); // Change fact every 3 seconds

    return () => clearInterval(intervalId);
  }, [popupId]);

  const closePopup = (id: number) => {
    setPopups((prevPopups) => prevPopups.filter((popup) => popup.id !== id));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-100">
      <h1 className="absolute top-10 left-1/2 transform -translate-x-1/2 text-3xl font-bold mb-4">
        Annoying Pigeon Facts!
      </h1>
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="absolute p-4 bg-blue-300 text-black border border-blue-500 rounded shadow-lg"
          style={{
            left: popup.x,
            top: popup.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <p className="text-lg">{popup.fact}</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => closePopup(popup.id)}
          >
            Close
          </button>
        </div>
      ))}
    </div>
  );
};

export default PigeonFactsRandom;
