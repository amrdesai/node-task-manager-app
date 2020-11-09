require('../src/db/mongoose');
const User = require('../src/models/user');

const updateAgeAndCount = async (id, age) => {
    const user = await User.findOneAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    return count;
};

updateAgeAndCount('5fa21f8cb606b9273c18f7e4', 2)
    .then((count) => {
        console.log(count);
    })
    .catch((error) => {
        console.log(error);
    });
