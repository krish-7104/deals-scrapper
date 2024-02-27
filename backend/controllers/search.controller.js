const searchUser = require('../models/search.model.js');

exports.getUserSearch = async (req, res) => {
  const userId = req.params.userId;
  try {
    const userSearch = await searchUser.findOne({ userId: userId });
    if (!userSearch) {
      return res.status(404).json({ message: 'User search data not found' });
    }
    return res.status(200).json(userSearch);
  } catch (error) {
    console.error('Error retrieving user search data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.storeUserSearch = async (req, res) => {
  const { userId, searches } = req.body;

  try {
    let userSearch = await searchUser.findOne({ userId: userId });
    if (!userSearch) {
      userSearch = new searchUser({ userId: userId, searches: searches });
    } else {
      const mergedSearches = Array.from(new Set([...userSearch.searches, ...searches]));
      userSearch.searches = mergedSearches;
    }
    await userSearch.save();
    return res.status(201).json({ message: 'User search data stored successfully' });
  } catch (error) {
    console.error('Error storing user search data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




