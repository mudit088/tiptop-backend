const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeschema = new Schema({
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    name: {
        type: String,
        require: true
    },
    employeetype: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Temporary', 'Interns', 'Seasonal', 'Leased'],
        require: true,
    },
    worktype: {
        type: String
    },
    dateofjoining: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: [true, "Email already Exists"],
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid email address'
        }
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (value) {
                return /^\d{10}$/.test(value);
            },
            message: 'Invalid mobile number'
        }
    },
    upiid: {
        //todo
        type: String,
        require: true
    },
    image: {
        //todo
        type: String,
        require: true
    },
});
const Employee = mongoose.model('employee', employeeschema);
module.exports = Employee;