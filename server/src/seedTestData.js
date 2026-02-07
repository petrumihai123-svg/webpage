const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');

const seedUsers = async () => {
    const users = [
        { username: 'user1', password: 'password', role: 'USER' },
        { username: 'agent1', password: 'password', role: 'AGENT' },
        { username: 'admin1', password: 'password', role: 'ADMIN' }
    ];

    await User.deleteMany({});
    for (let user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await User.create({
            username: user.username,
            password: hashedPassword,
            role: user.role
        });
    }
};

const seedTickets = async () => {
    const tickets = [
        { title: 'Test Ticket 1', description: 'Description for Test Ticket 1', userId: 'user1' },
        { title: 'Test Ticket 2', description: 'Description for Test Ticket 2', userId: 'agent1' },
    ];

    await Ticket.deleteMany({});
    for (let ticket of tickets) {
        await Ticket.create(ticket);
    }
};

const seedComments = async () => {
    const comments = [
        { content: 'This is a test comment for Ticket 1', ticketId: 'ticket1', userId: 'user1' },
        { content: 'This is another test comment for Ticket 2', ticketId: 'ticket2', userId: 'admin1' },
    ];

    await Comment.deleteMany({});
    for (let comment of comments) {
        await Comment.create(comment);
    }
};

const seedTestData = async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb');
    await seedUsers();
    await seedTickets();
    await seedComments();
    console.log('Test data seeded!');
    mongoose.connection.close();
};

seedTestData();
