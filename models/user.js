const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	type: {
			type: String,
			enum: ['User','Admin']
		},
	cart: [{type: mongoose.Schema.Types.ObjectId, ref: 'Textbook'}],
	wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Textbook'}]
});

// Our own user finding function 
UserSchema.statics.findByUsernamePassword = function(username, password) {
	const User = this
	
	return User.findOne({username: username}).then((user) => {
		if (!user) {
			return Promise.reject()
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (error, result) => {
				if (result) {
					resolve(user);
				} else {
					reject();
				}
			})
		})
	})
}

// This function runs before saving user to database
UserSchema.pre('save', function(next) {
	const user = this

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(user.password, salt, (error, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next();
	}

})

const User = mongoose.model('User', UserSchema);

module.exports = { User };