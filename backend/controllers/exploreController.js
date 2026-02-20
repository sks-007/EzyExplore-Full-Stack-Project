export const getExploreIntro = (req, res) => {
  res.json({
    title: "Discover Your Next Adventure 🌍",
    description: "Plan your perfect trip, meet local buddies, and explore destinations like never before!",
    coverImage: "/images/cover.jpg"
  });
};